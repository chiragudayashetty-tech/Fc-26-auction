import { useState, useEffect, useReducer, useRef } from 'react';
import Peer from 'peerjs';

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

export const getSavedHostState = () => {
    try {
        const saved = localStorage.getItem('fc26_host_state');
        if (saved) return JSON.parse(saved);
    } catch {}
    return null;
};

export const clearSession = () => {
    localStorage.removeItem('fc26_session');
    localStorage.removeItem('fc26_host_state');
};

export function useMultiplayer(reducer, initialState) {
    const [state, dispatchLocal] = useReducer(reducer, initialState);
    const [peerStatus, setPeerStatus] = useState("disconnected");
    const peerRef = useRef(null);
    const connsRef = useRef([]); 
    const hostConnRef = useRef(null);
    const session = getLocalSession();

    const dispatch = (action) => {
        const actionWithUid = { ...action, _senderUid: session.uid };
        if (peerStatus === "client" && hostConnRef.current) {
            hostConnRef.current.send({ type: "ACTION", action: actionWithUid });
        } else {
            dispatchLocal(actionWithUid);
        }
    };

    useEffect(() => {
        if (peerStatus === "host") {
            const stateStr = JSON.stringify(state);
            localStorage.setItem('fc26_host_state', stateStr);
            if (connsRef.current.length > 0) {
                connsRef.current.forEach(conn => {
                    if (conn.open) conn.send({ type: "STATE", state: stateStr });
                });
            }
        }
    }, [state, peerStatus]);

    const initHost = (roomId) => {
        const peerId = `FC26-${roomId}`;
        setPeerStatus("connecting");
        const peer = new Peer(peerId);
        peerRef.current = peer;

        saveLocalSession({ roomId, isHost: true });

        peer.on('open', () => {
            setPeerStatus("host");
        });

        peer.on('connection', (conn) => {
            conn.on('open', () => {
                connsRef.current.push(conn);
                conn.send({ type: "STATE", state: JSON.stringify(state) });
            });

            conn.on('data', (data) => {
                if (data && data.type === "ACTION") {
                    if (data.action.type === "JOIN_ROOM") {
                        conn.clientUid = data.action.uid;
                    }
                    dispatchLocal(data.action);
                }
            });

            conn.on('close', () => {
                connsRef.current = connsRef.current.filter(c => c.peer !== conn.peer);
                if (conn.clientUid) {
                    dispatchLocal({ type: "CLIENT_DISCONNECT", uid: conn.clientUid, _senderUid: "HOST" });
                }
            });
        });

        peer.on('error', (err) => {
            console.error("PeerJS Error (Host):", err);
            if (err.type === 'unavailable-id') {
                alert("Room code already in use or reconnecting. Wait a minute and try again.");
            } else {
                alert("Multiplayer connection error. Check console.");
            }
            setPeerStatus("disconnected");
        });
    };

    const joinRoom = (roomId, name, teamName) => {
        const hostPeerId = `FC26-${roomId}`;
        setPeerStatus("connecting");
        const peer = new Peer();
        peerRef.current = peer;

        saveLocalSession({ roomId, isHost: false, name, team: teamName });

        peer.on('open', () => {
            const conn = peer.connect(hostPeerId, { reliable: true });
            hostConnRef.current = conn;

            conn.on('open', () => {
                setPeerStatus("client");
                conn.send({ type: "ACTION", action: { type: "JOIN_ROOM", uid: session.uid, name, team: teamName } });
            });

            conn.on('data', (data) => {
                if (data && data.type === "STATE") {
                    dispatchLocal({ type: "SYNC_STATE", state: JSON.parse(data.state) });
                }
            });

            conn.on('close', () => {
                setPeerStatus("disconnected");
                alert("Host disconnected or auction ended.");
            });
        });

        peer.on('error', (err) => {
            console.error("PeerJS Error (Client):", err);
            alert("Failed to connect to room. Make sure the code is correct and the Host is online.");
            setPeerStatus("disconnected");
        });
    };

    return { state, dispatch, peerStatus, initHost, joinRoom, session, dispatchLocal };
}
