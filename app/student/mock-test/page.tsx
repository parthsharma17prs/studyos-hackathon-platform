"use client";
import React from 'react';

export default function MockTestPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black flex flex-col">
      <div className="p-4 bg-gray-900 text-white flex justify-between items-center text-sm">
        <p>
          <strong>Notice:</strong> This section is rendering the exact clone of the requested Mock Test repository. 
        </p>
        <p>Make sure the local server is running on <code className="bg-gray-800 px-2 py-1 rounded">localhost:5173</code>.</p>
      </div>
      <iframe 
        src="http://localhost:5173" 
        className="w-full flex-1 border-none"
        title="Mock Test Framework"
        allow="camera; microphone; fullscreen; display-capture; clipboard-read"
      />
    </div>
  );
}
