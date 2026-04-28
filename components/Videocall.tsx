"use client";

import { PhoneOff, Video, Mic, MicOff, VideoOff } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRtc";
import { useState } from "react";
import { useUser } from "@/lib/userContext";

export default function VideoRoom({
  roomId,
  onClose,
}: {
  roomId: string;
  onClose: () => void;
}) {
  const { user } = useUser();

  const { peers, localVideoRef, toggleMic, toggleCamera } = useWebRTC(
    roomId,
    user?.username || "Anonymous",
    user?.role === "doctor"
  );

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  /* ---------------- TOGGLES ---------------- */
  const handleMic = () => {
    const newState = !micOn;
    setMicOn(newState);
    toggleMic(newState);
  };

  const handleCam = () => {
    const newState = !camOn;
    setCamOn(newState);
    toggleCamera(newState);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black z-50 flex flex-col text-white">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold">Live Consultation Room</h2>
          <p className="text-xs text-gray-400">Secure WebRTC Video Session</p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
        >
          <PhoneOff size={18} />
        </button>
      </div>

      {/* VIDEO GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">

        {/* LOCAL USER */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">

          {/* VIDEO */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-[340px] object-cover transition duration-300 ${
              !camOn ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* CAMERA OFF OVERLAY */}
          {!camOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              <VideoOff size={50} className="text-red-500 mb-2" />
              <p className="text-sm text-gray-300">Camera is turned off</p>
            </div>
          )}

          {/* LABEL */}
          <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-xl text-sm">
            You ({user?.role === "doctor" ? "Doctor" : "Host"})
          </div>

          <div className="absolute top-3 right-3 text-xs text-green-400 bg-black/60 px-2 py-1 rounded-lg">
            ● Live
          </div>

          {/* FLOAT CONTROLS */}
          <div className="absolute bottom-3 right-3 flex gap-2">

            <button
              onClick={handleMic}
              className={`p-2 rounded-lg transition ${
                micOn ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>

            <button
              onClick={handleCam}
              className={`p-2 rounded-lg transition ${
                camOn ? "bg-blue-600" : "bg-red-600"
              }`}
            >
              {camOn ? <Video size={16} /> : <VideoOff size={16} />}
            </button>

          </div>
        </div>

        {/* REMOTE USERS */}
        {peers.map((peer, index) => (
          <div
            key={peer.id}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl"
          >
            <video
              autoPlay
              playsInline
              className="w-full h-[340px] object-cover"
              ref={(video) => {
                if (video && peer.stream) {
                  video.srcObject = peer.stream;
                }
              }}
            />

            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-xl text-sm">
              Participant {index + 1}
            </div>

            <div className="absolute top-3 right-3 text-xs text-green-400 bg-black/60 px-2 py-1 rounded-lg">
              ● Live
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center gap-5 p-5 border-t border-white/10 bg-black/40 backdrop-blur-xl">

        <button
          onClick={handleMic}
          className={`p-3 rounded-xl ${
            micOn ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        <button
          onClick={handleCam}
          className={`p-3 rounded-xl ${
            camOn ? "bg-blue-600" : "bg-red-600"
          }`}
        >
          {camOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>

        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700"
        >
          End Call
        </button>

      </div>
    </div>
  );
}