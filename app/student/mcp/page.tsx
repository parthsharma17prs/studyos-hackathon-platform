'use client';

import { useState } from 'react';
import Ribbon from '@/components/shared/Ribbon';

export default function MCPToolsPage() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [sumResult, setSumResult] = useState<number | null>(null);

  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);
  const [randomResult, setRandomResult] = useState<number | null>(null);
  
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const callAdd = async () => {
    setLoadingType('add');
    try {
      // In a real scenario, this would use an MCP Client strictly.
      // For this hackathon demo, we simulate calling the remote MCP Server API locally or replicating it.
      const res = await fetch('/api/mcp/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a, b }),
      });
      const data = await res.json();
      setSumResult(data.result);
    } catch (e) {
      console.error(e);
      setSumResult(null);
    } finally {
      setLoadingType(null);
    }
  };

  const callRandom = async () => {
    setLoadingType('random');
    try {
      const res = await fetch('/api/mcp/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end }),
      });
      const data = await res.json();
      setRandomResult(data.result);
    } catch (e) {
      console.error(e);
      setRandomResult(null);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2">Remote MCP Tools</h2>
        <p className="text-os-muted">Accessing external AI capabilities from the connected Remote MCP Server.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass-card p-8 border-student-accent">
            <h3 className="text-xl font-bold mb-4">AI Calculator</h3>
            <p className="text-sm text-os-muted mb-6">Executes the `add` tool on the FastMCP server.</p>
            <div className="flex gap-4 mb-4">
               <input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-3 text-white outline-none" />
               <span className="text-2xl font-black text-student-accent">+</span>
               <input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-3 text-white outline-none" />
            </div>
            <button onClick={callAdd} className="btn-primary-student w-full mb-4">
               {loadingType === 'add' ? 'Calculating...' : 'Compute Sum'}
            </button>
            {sumResult !== null && (
               <div className="bg-student-accent/10 border border-student-accent text-student-accent p-4 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold tracking-widest block mb-1">Result</span>
                  <span className="text-4xl font-black">{sumResult}</span>
               </div>
            )}
         </div>

         <div className="glass-card p-8 border-student-accent">
            <h3 className="text-xl font-bold mb-4">Random Generator</h3>
            <p className="text-sm text-os-muted mb-6">Executes the `random_number` tool via MCP.</p>
            <div className="flex gap-4 mb-4">
               <div className="w-full">
                  <label className="text-xs uppercase text-os-muted mb-1 block">Min</label>
                  <input type="number" value={start} onChange={e => setStart(Number(e.target.value))} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-3 text-white outline-none" />
               </div>
               <div className="w-full">
                  <label className="text-xs uppercase text-os-muted mb-1 block">Max</label>
                  <input type="number" value={end} onChange={e => setEnd(Number(e.target.value))} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-3 text-white outline-none" />
               </div>
            </div>
            <button onClick={callRandom} className="btn-primary-student w-full mb-4">
               {loadingType === 'random' ? 'Generating...' : 'Pick Random'}
            </button>
            {randomResult !== null && (
               <div className="bg-student-accent/10 border border-student-accent text-student-accent p-4 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold tracking-widest block mb-1">Result</span>
                  <span className="text-4xl font-black">{randomResult}</span>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
