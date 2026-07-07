import { useState, useEffect, useReducer, useRef } from 'react';
import { supabase } from './supabaseClient';

export const getLocalSession = () => {
    try {
        let session = JSON.parse(localStorage.getItem('fc26_session'));
        if (!session || !session.uid) {
            session = { uid: `u_${Math.random().toString(36).substring(2, 10)}` };
            localStorage.setItem('fc26_session', JSON.stringify(session));
        }
        return session;
    } catch {
        return { uid: `u_${Math.random().toString(36).substring(2, 10)}` };
    }
};

export const saveLocalSession = (data) => {
    try {
        const session = getLocalSession();
        localStorage.setItem('fc26_session', JSON.stringify({ ...session, ...data }));
    } catch {}
};

export const clearSession = () => {
    localStorage.removeItem('fc26_session');
};

export function useMultiplayer(reducer, initialState) {
    const [state, dispatchLocal] = useReducer(reducer, initialState);
    const [peerStatus, setPeerStatus] = useState("disconnected");
    const channelRef = useRef(null);
    const session = getLocalSession();
    const roomIdRef = useRef(session.roomId);
    
    const peerStatusRef = useRef(peerStatus);
    const setPeerStatusSync = (status) => {
        peerStatusRef.current = status;
        setPeerStatusSync(status);
    };
    
    // Guard to prevent overwriting DB with empty lobby on refresh
    const dbStateFetched = useRef(false);

    const dispatch = (action) => {
        const actionWithUid = { ...action, _senderUid: session.uid };
        if (peerStatus === "client" && channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'ACTION',
                payload: { action: actionWithUid }
            }).catch(err => console.error("Broadcast err", err));
        } else {
            dispatchLocal(actionWithUid);
        }
    };

    useEffect(() => {
        if (peerStatus === "host" && channelRef.current && roomIdRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'STATE',
                payload: { state }
            }).catch(err => console.error("Broadcast err", err));
            
            // Only upsert to Supabase if we have successfully fetched the true state OR if we actively progressed
            if (dbStateFetched.current || state.phase !== "lobby") {
                supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
                    const admin_id = sbSession?.user?.id || null;
                    supabase.from('rooms').upsert({ id: roomIdRef.current, state, admin_id }).then(({ error }) => {
                        if (error) console.error("Supabase upsert error:", error);
                    });
                });
            }
        }
    }, [state, peerStatus]);

    // Unified channel setup for both Host and Client
    const setupChannel = (channel) => {
        channel
            .on('broadcast', { event: 'ACTION' }, (payload) => {
                // Only host processes ACTIONs
                if (peerStatusRef.current === "host") {
                    dispatchLocal(payload.payload.action);
                }
            })
            .on('broadcast', { event: 'STATE' }, (payload) => {
                // Only clients sync STATE
                if (peerStatusRef.current === "client") {
                    dispatchLocal({ type: "SYNC_STATE", state: payload.payload.state });
                }
            })
            .on('presence', { event: 'sync' }, () => {
                const pState = channel.presenceState();
                const allPresences = Object.values(pState).flat();
                
                const activeHosts = allPresences.filter(p => p.isHost);
                const amIHost = peerStatusRef.current === "host";
                
                // If there are NO hosts, the clients negotiate a takeover
                if (activeHosts.length === 0 && allPresences.length > 0 && !amIHost) {
                    // Sort deterministically to pick a new host
                    const sorted = allPresences.sort((a, b) => a.uid.localeCompare(b.uid));
                    if (sorted[0].uid === session.uid) {
                        console.log("Host missing! Promoting myself to Host...");
                        setTimeout(async () => {
                            // Double check before actually promoting
                            const freshState = channel.presenceState();
                            const freshHosts = Object.values(freshState).flat().filter(p => p.isHost);
                            if (freshHosts.length === 0) {
                                dbStateFetched.current = true; // prevent DB wipe
                                setPeerStatusSync("host");
                                saveLocalSession({ isHost: true });
                                await channel.track({ uid: session.uid, isHost: true, isOriginalHost: false });
                            }
                        }, Math.random() * 500 + 500); // 500-1000ms delay to prevent race
                    }
                }
                
                // If original host rejoins, stand-in host steps down
                if (amIHost && !session.isOriginalAdmin) {
                    const originalHosts = activeHosts.filter(p => p.isOriginalHost);
                    if (originalHosts.length > 0) {
                        console.log("Original host returned. Stepping down to client...");
                        setPeerStatusSync("client");
                        saveLocalSession({ isHost: false });
                        channel.track({ uid: session.uid, isHost: false, isOriginalHost: false });
                    }
                }
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                if (peerStatusRef.current === "host") {
                    leftPresences.forEach(p => {
                        if (p.uid && p.uid !== session.uid) {
                            dispatchLocal({ type: "CLIENT_DISCONNECT", uid: p.uid, _senderUid: "HOST" });
                        }
                    });
                }
            });
            
        return channel;
    };

    const initHost = async (roomId) => {
        setPeerStatusSync("connecting");
        roomIdRef.current = roomId;
        saveLocalSession({ roomId, isHost: true, isOriginalAdmin: true });
        session.isOriginalAdmin = true;

        try {
            const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single();
            if (data && data.state) {
                dispatchLocal({ type: "SYNC_STATE", state: data.state });
                dbStateFetched.current = true;
            }
        } catch (err) {
            console.warn("Room state fetch failed (expected for new rooms):", err);
            dbStateFetched.current = true; // New room, ok to save
        }

        const channel = supabase.channel(`room_${roomId}`);
        channelRef.current = channel;
        setupChannel(channel);

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                setTimeout(async () => {
                    setPeerStatusSync("host");
                    await channel.track({ uid: session.uid, isHost: true, isOriginalHost: true });
                }, 100);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                alert("Multiplayer connection error. Check Supabase config.");
                setPeerStatusSync("disconnected");
            }
        });
    };

    const joinRoom = async (roomId, name, teamName) => {
        setPeerStatusSync("connecting");
        roomIdRef.current = roomId;
        saveLocalSession({ roomId, isHost: false, name, team: teamName });

        try {
            const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single();
            if (data && data.state) {
                dispatchLocal({ type: "SYNC_STATE", state: data.state });
            }
        } catch (err) {
            console.warn("Room state fetch failed:", err);
        }

        const channel = supabase.channel(`room_${roomId}`);
        channelRef.current = channel;
        setupChannel(channel);

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                setPeerStatusSync("client");
                await channel.track({ uid: session.uid, isHost: false, isOriginalHost: false });
                channel.send({
                    type: 'broadcast',
                    event: 'ACTION',
                    payload: { action: { type: "JOIN_ROOM", uid: session.uid, name, team: teamName } }
                });
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                alert("Failed to connect to room. Check connection.");
                setPeerStatusSync("disconnected");
            }
        });
    };

    return { state, dispatch, peerStatus, initHost, joinRoom, session, dispatchLocal };
}
