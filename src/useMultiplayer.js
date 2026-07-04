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
            
            // Upsert state to Supabase
            supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
                const admin_id = sbSession?.user?.id || null;
                supabase.from('rooms').upsert({ id: roomIdRef.current, state, admin_id }).then(({ error }) => {
                    if (error) console.error("Supabase upsert error:", error);
                });
            });
        }
    }, [state, peerStatus]);

    const initHost = async (roomId) => {
        setPeerStatus("connecting");
        roomIdRef.current = roomId;
        saveLocalSession({ roomId, isHost: true });

        // Safely fetch latest state before allowing useEffect to overwrite
        try {
            const { data } = await supabase.from('rooms').select('state').eq('id', roomId).single();
            if (data && data.state) {
                dispatchLocal({ type: "SYNC_STATE", state: data.state });
            }
        } catch (err) {
            console.warn("Room state fetch failed (expected for new rooms):", err);
        }

        const channel = supabase.channel(`room_${roomId}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'ACTION' }, (payload) => {
                dispatchLocal(payload.payload.action);
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                leftPresences.forEach(p => {
                    if (p.uid && p.uid !== session.uid) {
                        dispatchLocal({ type: "CLIENT_DISCONNECT", uid: p.uid, _senderUid: "HOST" });
                    }
                });
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Small delay to ensure any React state batched updates (like SYNC_STATE) finish rendering
                    setTimeout(async () => {
                        setPeerStatus("host");
                        await channel.track({ uid: session.uid, isHost: true });
                    }, 100);
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    alert("Multiplayer connection error. Check Supabase config.");
                    setPeerStatus("disconnected");
                }
            });
    };

    const joinRoom = async (roomId, name, teamName) => {
        setPeerStatus("connecting");
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

        channel
            .on('broadcast', { event: 'STATE' }, (payload) => {
                dispatchLocal({ type: "SYNC_STATE", state: payload.payload.state });
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    setPeerStatus("client");
                    await channel.track({ uid: session.uid, isHost: false });
                    channel.send({
                        type: 'broadcast',
                        event: 'ACTION',
                        payload: { action: { type: "JOIN_ROOM", uid: session.uid, name, team: teamName } }
                    });
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    alert("Failed to connect to room. Check connection.");
                    setPeerStatus("disconnected");
                }
            });
    };

    return { state, dispatch, peerStatus, initHost, joinRoom, session, dispatchLocal };
}
