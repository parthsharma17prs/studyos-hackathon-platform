'use client';

import { useState, useEffect } from 'react';
import Ribbon from '@/components/shared/Ribbon';

export default function BattleMode() {
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [players, setPlayers] = useState([{ name: 'You', score: 0, status: 'ready' }]);
  const [countdown, setCountdown] = useState(0);

  // Mocking Firebase Realtime DB functionality for Hackathon demo purposes
  const generateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(code);
    setInRoom(true);
    setIsCreator(true);
  };

  const joinRoom = () => {
    if (!roomId || roomId.length !== 6) return;
    setInRoom(true);
    setIsCreator(false);
    setPlayers([{ name: 'Friend', score: 0, status: 'ready' }, { name: 'You', score: 0, status: 'ready' }]);
  };

  const startDemoMatch = () => {
     setCountdown(3);
     const int = setInterval(() => {
        setCountdown(prev => {
           if (prev <= 1) { clearInterval(int); alert("In a full build, this instantly loads the shared Quiz view and connects to Firebase RTDB for live scoreboard updates."); return 0; }
           return prev - 1;
        })
     }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center mt-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter mb-4 text-student-accent glow-text-red">Peer Battle Mode ⚔️</h2>
        <p className="text-os-muted text-lg max-w-xl mx-auto">Challenge your classmates to a real-time smart quiz. Loser buys the snacks.</p>
      </div>

      {!inRoom ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="glass-card p-12 hover:border-student-accent transition-colors">
              <div className="text-5xl mb-6">🛡️</div>
              <h3 className="text-2xl font-black mb-4">Create a Battle</h3>
              <p className="text-sm text-os-muted mb-8">Generate a room code and invite your friends. You pick the study notes.</p>
              <button onClick={generateRoom} className="btn-primary-student w-full">Generate Code →</button>
           </div>
           
           <div className="glass-card p-12 hover:border-student-accent transition-colors relative">
              <div className="vertical-line hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-px h-3/4 bg-os-border" />
              <div className="text-5xl mb-6">⚔️</div>
              <h3 className="text-2xl font-black mb-4">Join a Battle</h3>
              <p className="text-sm text-os-muted mb-8">Got a code? Enter it below to join the arena.</p>
              <input 
                 type="text" 
                 placeholder="6-DIGIT CODE" 
                 maxLength={6}
                 className="w-full bg-os-card border-2 border-os-border focus:border-student-accent text-center text-3xl font-black tracking-[0.5em] rounded-xl p-4 mb-4 uppercase text-white outline-none transition-colors"
                 value={roomId}
                 onChange={e => setRoomId(e.target.value.toUpperCase())}
              />
              <button 
                onClick={joinRoom} 
                disabled={roomId.length !== 6} 
                className={"w-full py-4 text-lg btn-outline flex justify-center uppercase font-black tracking-widest" + (roomId.length !== 6 ? " opacity-50 cursor-not-allowed border-os-border text-os-muted hover:bg-transparent" : " border-student-accent hover:border-student-accent")}
              >
                 Enter Arena ↵
              </button>
           </div>
        </div>
      ) : (
        <div className="glass-card p-12 max-w-2xl mx-auto mt-12 bg-black border-2 border-student-accent glow-red relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-screen" />
           <h3 className="text-sm font-bold uppercase tracking-widest text-os-muted mb-2 relative z-10">Room Code</h3>
           <div className="text-6xl font-black tracking-[0.5em] text-white DropShadow-red mb-8 relative z-10">{roomId}</div>
           
           <div className="space-y-4 mb-12 relative z-10">
              {players.map((p, i) => (
                 <div key={i} className="flex justify-between items-center bg-os-card p-4 rounded-xl border border-os-border">
                    <span className="font-bold text-lg flex items-center gap-2">
                       <div className="w-8 h-8 rounded bg-student-accent/20 flex items-center justify-center text-student-accent mr-2">{p.name.charAt(0)}</div>
                       {p.name} {p.name === 'You' && <span className="text-xs ml-2 text-student-accent italic">(Host)</span>}
                    </span>
                    <span className="text-status-good text-sm font-bold uppercase tracking-wider">{p.status}</span>
                 </div>
              ))}
              {isCreator && players.length === 1 && (
                 <div className="flex justify-between items-center bg-os-card border-dashed p-4 rounded-xl border border-os-border/50 animate-pulse">
                    <span className="font-bold text-lg text-os-muted">Waiting for friend...</span>
                    <span className="w-5 h-5 border-2 border-os-muted border-t-transparent rounded-full animate-spin" />
                 </div>
              )}
           </div>

           {countdown > 0 ? (
               <div className="text-9xl font-black text-student-accent animate-ping absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md">
                   {countdown}
               </div>
           ) : isCreator && (
              <button 
                 onClick={startDemoMatch}
                 className="w-full py-5 text-xl bg-student-accent text-white font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all relative z-10 shadow-[0_0_40px_rgba(255,0,0,0.4)]"
              >
                 🔥 Start Battle 🔥
              </button>
           )}
           
           {!isCreator && countdown === 0 && (
              <button 
                 disabled
                 className="w-full py-5 text-xl bg-os-border text-os-muted font-black uppercase tracking-[0.2em] rounded-xl cursor-not-allowed relative z-10"
              >
                 Waiting for host...
              </button>
           )}
        </div>
      )}
    </div>
  );
}
