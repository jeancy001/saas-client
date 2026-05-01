import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Peer = {
  id: string;
  name?: string;
  stream: MediaStream;
  isHost?: boolean;
};

export function useWebRTC(
  roomId: string,
  userName: string,
  isHost = false
) {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const socket = io("https://saas-server-bay.vercel.app", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ---------------- INIT MEDIA ---------------- */
  useEffect(() => {
    if (!socketRef.current) return;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socketRef.current?.emit("join-room", {
          roomId,
          userId: socketRef.current.id,
          name: userName,
          isHost,
        });
      } catch (err) {
        console.error("Media error:", err);
      }
    };

    init();
  }, [roomId, userName, isHost]);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !localStream) return;

    const createPeer = (userId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            target: userId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0];

        setPeers((prev) => {
          const exists = prev.find((p) => p.id === userId);

          if (exists) return prev;

          return [
            ...prev,
            {
              id: userId,
              stream,
              name: "Participant",
            },
          ];
        });
      };

      peerConnections.current[userId] = pc;

      return pc;
    };

    /* ---------------- USER JOINED ---------------- */
    socket.on("user-joined", async (userId: string) => {
      const pc = createPeer(userId);

      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        target: userId,
        sdp: offer,
      });
    });

    /* ---------------- OFFER ---------------- */
    socket.on("offer", async ({ sdp, caller }) => {
      const pc = createPeer(caller);

      await pc.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        target: caller,
        sdp: answer,
      });
    });

    /* ---------------- ANSWER ---------------- */
    socket.on("answer", async ({ sdp, caller }) => {
      const pc = peerConnections.current[caller];

      if (pc) {
        await pc.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      }
    });

    /* ---------------- ICE ---------------- */
    socket.on(
      "ice-candidate",
      async ({ candidate, caller }) => {
        const pc = peerConnections.current[caller];

        if (pc && candidate) {
          await pc.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      }
    );

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      Object.values(peerConnections.current).forEach((pc) =>
        pc.close()
      );
    };
  }, [localStream]);

  /* ---------------- CONTROLS ---------------- */

  const toggleMic = (enabled: boolean) => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  const toggleCamera = (enabled: boolean) => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  return {
    peers,
    localVideoRef,
    localStream,
    toggleMic,
    toggleCamera,
  };
}