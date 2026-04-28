import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://saas-server-bay.vercel.app");

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
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  /* ---------------- INIT MEDIA ---------------- */
  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit("join-room", {
        roomId,
        userId: socket.id,
        name: userName,
        isHost,
      });
    };

    init();
  }, [roomId]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!localStream) return;

    const createPeer = (userId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
          const filtered = prev.filter((p) => p.id !== userId);

          return [
            ...filtered,
            {
              id: userId,
              stream,
              name: "Participant",
              isHost: false,
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

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));

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
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    /* ---------------- ICE ---------------- */
    socket.on("ice-candidate", async ({ candidate, caller }) => {
      const pc = peerConnections.current[caller];
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [localStream]);

  /* ---------------- MIC / VIDEO CONTROL ---------------- */
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