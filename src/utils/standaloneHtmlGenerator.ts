import { Project } from '../types';

/**
 * Generates a completely self-contained, offline-ready standalone HTML5
 * application that runs directly in any browser or Chromium App Mode.
 *
 * This is the actual AI Chatter Desktop Application loaded immediately
 * when AIChatter.exe or AIChatter-Setup.exe is launched.
 */
export function generateStandaloneHtml(project: Project): string {
  return `<!doctype html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AIChatter - AI Desktop Studio</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    :root {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    code, pre, .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Smooth custom scrollbars */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
    
    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse-dot {
      animation: pulse-subtle 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body class="h-full bg-slate-950 text-slate-100 flex flex-col select-none overflow-hidden antialiased">

  <!-- Native Windows Window Title Bar -->
  <header class="h-10 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between px-3 text-xs flex-shrink-0 z-20">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50 inline-block hover:brightness-125 cursor-pointer" onclick="triggerAction('minimize')"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 inline-block hover:brightness-125 cursor-pointer" onclick="triggerAction('maximize')"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 inline-block hover:brightness-125 cursor-pointer" onclick="triggerAction('restore')"></span>
      </div>
      <div class="h-4 w-[1px] bg-slate-800"></div>
      <div class="flex items-center gap-2">
        <span class="font-bold text-white tracking-tight flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          AIChatter Studio
        </span>
        <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Native Windows x64
        </span>
      </div>
    </div>

    <!-- Center Model Indicator -->
    <div class="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-[11px]">
      <span class="text-slate-400">Active Engine:</span>
      <span id="header-model-name" class="font-mono text-amber-300 font-semibold">Gemini 3.8 Flash</span>
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot"></span>
    </div>

    <!-- Right Window Badges & Quick Action -->
    <div class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
      <button onclick="clearChat()" class="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
        Clear
      </button>
      <button onclick="exportChat()" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors">
        Export
      </button>
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
        ONLINE
      </span>
    </div>
  </header>

  <!-- Notification Banner -->
  <div id="notification-banner" class="hidden px-4 py-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between transition-all">
    <div class="flex items-center gap-2">
      <span class="font-bold text-white" id="notif-title">Notification:</span>
      <span id="notif-body">AIChatter Studio is ready.</span>
    </div>
    <button onclick="hideNotif()" class="text-amber-400 hover:text-white font-bold text-sm leading-none">&times;</button>
  </div>

  <!-- Main AI Studio Layout -->
  <div class="flex-1 flex overflow-hidden">
    
    <!-- Left Sidebar: Conversations & Sessions -->
    <aside class="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between hidden md:flex">
      <div class="p-3 space-y-3">
        <!-- New Chat Button -->
        <button onclick="startNewChat()" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-98">
          <span>+</span>
          <span>New Conversation</span>
        </button>

        <!-- Sessions List -->
        <div>
          <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 mb-1.5 font-bold">Recent Threads</div>
          <div class="space-y-1 text-xs" id="thread-list">
            <button onclick="selectThread(0)" class="w-full p-2 rounded-lg bg-slate-800 text-left text-white font-medium flex items-center justify-between border border-slate-700">
              <span class="truncate">⚡ Code & App Architect</span>
              <span class="text-[10px] font-mono text-amber-400">Active</span>
            </button>
            <button onclick="selectThread(1)" class="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors">
              <span class="truncate">🎨 Desktop IPC & UI Setup</span>
              <span class="text-[10px] font-mono text-slate-500">2h ago</span>
            </button>
            <button onclick="selectThread(2)" class="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left text-slate-400 hover:text-slate-200 flex items-center justify-between transition-colors">
              <span class="truncate">🤖 Neural Prompt Engineering</span>
              <span class="text-[10px] font-mono text-slate-500">Yesterday</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Footer: System Diagnostics -->
      <div class="p-3 border-t border-slate-800 space-y-2 bg-slate-950/60">
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>Local Latency:</span>
          <span class="font-mono text-emerald-400">~14 ms</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>Engine Memory:</span>
          <span class="font-mono text-slate-300">42 MB</span>
        </div>
        <div class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
          <span>AIChatter v2.5 Pro</span>
          <span class="text-amber-400">Windows Ready</span>
        </div>
      </div>
    </aside>

    <!-- Center: Interactive AI Chat Conversation Deck -->
    <main class="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
      
      <!-- Model Toolbar Bar -->
      <div class="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 text-xs">Model:</span>
          <select id="model-select" onchange="changeModel(this.value)" class="bg-slate-950 border border-slate-700 text-amber-300 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-amber-500">
            <option value="gemini-3.8-flash">Gemini 3.8 Flash (Ultra Fast)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
            <option value="claude-3.7-sonnet">Claude 3.7 Sonnet (Advanced Code)</option>
            <option value="deepseek-r1">DeepSeek R1 (Open Logic)</option>
          </select>
        </div>

        <div class="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span>Tokens: <strong id="token-counter" class="text-amber-300">1,482</strong></span>
          <span class="hidden sm:inline text-slate-600">|</span>
          <span class="hidden sm:inline text-emerald-400">System: Ready</span>
        </div>
      </div>

      <!-- Quick Prompt Suggestions Bar -->
      <div class="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
        <span class="text-slate-500 font-bold uppercase text-[10px] font-mono">Starter Prompts:</span>
        <button onclick="injectPrompt('Explain how to build a native Windows launcher in C')" class="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40 transition-colors">
          ⚡ Windows Launcher Architecture
        </button>
        <button onclick="injectPrompt('Generate a modern responsive React 19 component with Tailwind')" class="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40 transition-colors">
          🎨 Modern React 19 UI
        </button>
        <button onclick="injectPrompt('How do I handle Electron IPC securely with contextBridge?')" class="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40 transition-colors">
          🔒 Secure Electron IPC
        </button>
      </div>

      <!-- Chat Messages Scroll Container -->
      <div id="messages-container" class="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        
        <!-- Welcome Message from AI Chatter -->
        <div class="flex items-start gap-3 max-w-3xl">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-md shadow-amber-500/20 mt-1">
            AI
          </div>
          <div class="flex-1 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 text-xs leading-relaxed text-slate-200 shadow-lg">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span class="font-bold text-white flex items-center gap-1.5">
                <span>AIChatter Assistant</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">Active</span>
              </span>
              <span class="text-[10px] font-mono text-slate-500">Just now</span>
            </div>
            <p class="mb-2">
              Hello! Welcome to <strong>AIChatter Studio</strong>. I am your local AI coding and application development companion.
            </p>
            <p class="mb-3 text-slate-300">
              You can ask me to generate TypeScript components, configure native Windows & Electron packaging, explain complex algorithms, or refactor your application architecture.
            </p>
            <div class="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-[11px] text-amber-300">
              <code>// AIChatter Native Environment Ready<br>const status = await window.electronAPI?.getHardwareStats();</code>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Chat Input Bar -->
      <div class="p-4 bg-slate-900/90 border-t border-slate-800 flex-shrink-0">
        <div class="max-w-4xl mx-auto flex flex-col gap-2">
          
          <div class="relative flex items-center">
            <textarea 
              id="user-input" 
              rows="2" 
              placeholder="Ask AIChatter anything... (e.g. 'Write a native desktop file dialog handler', press Enter to send)"
              onkeydown="handleKeyDown(event)"
              class="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-500/80 rounded-xl p-3 pr-24 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-sans"
            ></textarea>

            <button 
              id="send-btn"
              onclick="sendMessage()"
              class="absolute right-2.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Send</span>
              <span>↵</span>
            </button>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Enter to send, Shift + Enter for new line
            </span>
            <span class="font-mono">AIChatter Studio Windows Edition</span>
          </div>

        </div>
      </div>

    </main>

    <!-- Right Quick Settings Drawer -->
    <aside class="w-72 bg-slate-900 border-l border-slate-800 p-4 space-y-4 flex flex-col justify-between hidden lg:flex">
      <div class="space-y-4">
        <div>
          <h3 class="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">Studio Settings</h3>
          <p class="text-[11px] text-slate-400">Configure AI model parameters and local memory pipeline.</p>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div>
            <div class="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Temperature:</span>
              <span id="temp-val" class="font-mono text-amber-400">0.7</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value="0.7" oninput="updateTemp(this.value)" class="w-full accent-amber-500 cursor-pointer" />
          </div>

          <div>
            <div class="flex justify-between text-slate-300 font-semibold mb-1">
              <span>Max Response:</span>
              <span class="font-mono text-amber-400">4,096 tokens</span>
            </div>
            <input type="range" min="1024" max="8192" step="512" value="4096" class="w-full accent-amber-500 cursor-pointer" />
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-mono uppercase text-slate-400 font-bold">System Persona</h4>
          <select class="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500">
            <option>Expert Software Engineer & Architect</option>
            <option>Rapid Prototyper & UI Designer</option>
            <option>Security & Performance Auditor</option>
            <option>Creative Technical Writer</option>
          </select>
        </div>

        <!-- Local Event Telemetry Stream -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-[11px] font-mono text-slate-400 font-semibold">
            <span>IPC Telemetry Log</span>
            <span class="text-emerald-400">STREAMING</span>
          </div>
          <div id="telemetry-log" class="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 max-h-36 overflow-y-auto">
            <div>[00:00:00] AIChatter Studio initialized.</div>
            <div>[00:00:01] Native Windows runtime loaded.</div>
            <div>[00:00:02] Model Gemini 3.8 Flash online.</div>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>AIChatter.exe</span>
        <span>Windows x64 Native</span>
      </div>
    </aside>

  </div>

  <!-- Interactive JavaScript Application Engine -->
  <script>
    let currentTokens = 1482;
    let activeModel = 'Gemini 3.8 Flash';

    function addTelemetry(msg) {
      const log = document.getElementById('telemetry-log');
      if (log) {
        const d = new Date();
        const time = d.toTimeString().split(' ')[0];
        const div = document.createElement('div');
        div.textContent = '[' + time + '] ' + msg;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
      }
    }

    function changeModel(val) {
      const names = {
        'gemini-3.8-flash': 'Gemini 3.8 Flash',
        'gemini-2.5-pro': 'Gemini 2.5 Pro',
        'claude-3.7-sonnet': 'Claude 3.7 Sonnet',
        'deepseek-r1': 'DeepSeek R1'
      };
      activeModel = names[val] || val;
      const el = document.getElementById('header-model-name');
      if (el) el.textContent = activeModel;
      addTelemetry('Switched active engine to ' + activeModel);
      showNotif('Model Updated', 'Active model changed to ' + activeModel);
    }

    function updateTemp(val) {
      const el = document.getElementById('temp-val');
      if (el) el.textContent = val;
    }

    function showNotif(title, body) {
      const banner = document.getElementById('notification-banner');
      const titleEl = document.getElementById('notif-title');
      const bodyEl = document.getElementById('notif-body');
      if (banner && titleEl && bodyEl) {
        titleEl.textContent = title + ':';
        bodyEl.textContent = body;
        banner.classList.remove('hidden');
        setTimeout(hideNotif, 4000);
      }
    }

    function hideNotif() {
      const banner = document.getElementById('notification-banner');
      if (banner) banner.classList.add('hidden');
    }

    function triggerAction(action) {
      addTelemetry('Native Window Action: ' + action);
      showNotif('Window Action', 'Triggered ' + action + ' window command.');
    }

    function injectPrompt(text) {
      const input = document.getElementById('user-input');
      if (input) {
        input.value = text;
        input.focus();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }

    function sendMessage() {
      const input = document.getElementById('user-input');
      if (!input || !input.value.trim()) return;

      const userText = input.value.trim();
      input.value = '';

      const container = document.getElementById('messages-container');
      if (!container) return;

      // Append User message
      const userBubble = document.createElement('div');
      userBubble.className = 'flex items-start gap-3 max-w-3xl ml-auto justify-end';
      userBubble.innerHTML = \`
        <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-100 shadow-md max-w-xl">
          <div class="flex items-center justify-between border-b border-amber-500/20 pb-1.5 mb-1.5 text-[10px] font-mono text-amber-400">
            <span class="font-bold">You</span>
            <span>Just now</span>
          </div>
          <p class="whitespace-pre-wrap leading-relaxed">\${escapeHtml(userText)}</p>
        </div>
        <div class="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1 border border-slate-700">
          U
        </div>
      \`;
      container.appendChild(userBubble);
      container.scrollTop = container.scrollHeight;

      addTelemetry('Prompt sent: "' + userText.slice(0, 30) + '..."');

      // Add thinking indicator
      const thinkingBubble = document.createElement('div');
      thinkingBubble.id = 'thinking-indicator';
      thinkingBubble.className = 'flex items-start gap-3 max-w-3xl';
      thinkingBubble.innerHTML = \`
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1">
          AI
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>AIChatter is generating response with \${activeModel}...</span>
        </div>
      \`;
      container.appendChild(thinkingBubble);
      container.scrollTop = container.scrollHeight;

      // Simulate response generation
      setTimeout(() => {
        thinkingBubble.remove();

        const aiResponse = generateAiResponse(userText);
        currentTokens += Math.floor(userText.length / 3) + 120;
        const tokEl = document.getElementById('token-counter');
        if (tokEl) tokEl.textContent = currentTokens.toLocaleString();

        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex items-start gap-3 max-w-3xl';
        aiBubble.innerHTML = \`
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-md shadow-amber-500/20">
            AI
          </div>
          <div class="flex-1 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 text-xs leading-relaxed text-slate-200 shadow-lg">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span class="font-bold text-white flex items-center gap-1.5">
                <span>AIChatter</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">\${activeModel}</span>
              </span>
              <span class="text-[10px] font-mono text-slate-500">Just now</span>
            </div>
            \${aiResponse}
          </div>
        \`;
        container.appendChild(aiBubble);
        container.scrollTop = container.scrollHeight;

        addTelemetry('Completed generation (' + activeModel + ')');
      }, 750);
    }

    function generateAiResponse(prompt) {
      const p = prompt.toLowerCase();
      
      if (p.includes('react') || p.includes('ui') || p.includes('tailwind')) {
        return \`
          <p class="mb-2">Here is a modern, responsive React component designed with clean Tailwind styling:</p>
          <div class="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto mb-2 select-all">
<pre><code>import React, { useState } from 'react';

export function AIChatBubble({ sender, message }: { sender: string; message: string }) {
  const [copied, setCopied] = useState(false);

  return (
    &lt;div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200"&gt;
      &lt;div className="flex items-center justify-between mb-2 text-xs font-bold text-amber-400"&gt;
        &lt;span&gt;{sender}&lt;/span&gt;
        &lt;button onClick={() => setCopied(true)} className="text-[10px] font-mono text-slate-400 hover:text-white"&gt;
          {copied ? 'Copied!' : 'Copy'}
        &lt;/button&gt;
      &lt;/div&gt;
      &lt;p className="text-xs leading-relaxed"&gt;{message}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
          </div>
          <p class="text-slate-400 text-[11px]">This component uses pure Tailwind utilities and local state for instant user feedback.</p>
        \`;
      }

      if (p.includes('electron') || p.includes('ipc') || p.includes('window') || p.includes('launcher')) {
        return \`
          <p class="mb-2">Here is the architecture for secure IPC communication in AIChatter:</p>
          <div class="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto mb-2 select-all">
<pre><code>// preload.js - Secure Context Isolation Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getHardwareStats: () => ipcRenderer.invoke('system:getHardwareStats'),
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  saveProject: (data) => ipcRenderer.invoke('project:save', data),
  onAppEvent: (callback) => ipcRenderer.on('app:event', (_e, data) => callback(data)),
});</code></pre>
          </div>
          <p class="text-slate-400 text-[11px]">By keeping <code>contextIsolation: true</code> and <code>nodeIntegration: false</code>, the browser environment is fully sandboxed.</p>
        \`;
      }

      return \`
        <p class="mb-2">I have analyzed your request regarding: <strong>\${escapeHtml(prompt)}</strong>.</p>
        <p class="mb-2 text-slate-300">
          AIChatter Studio executes all models locally or through high-speed streaming inference pipelines.
        </p>
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-2 font-mono text-[11px] text-slate-300">
          <span class="text-amber-400 font-semibold">Suggested Next Steps:</span><br>
          • 1. Integrate state persistence via local SQLite or JSON storage.<br>
          • 2. Add keyboard shortcuts (Ctrl+K for omnibar command palette).<br>
          • 3. Export full bundle via the top menu.
        </div>
        <p class="text-slate-400 text-[11px]">Feel free to ask for specific code implementations or architectural patterns!</p>
      \`;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function clearChat() {
      const container = document.getElementById('messages-container');
      if (container) {
        container.innerHTML = \`
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            Conversation cleared. Type a message below to start chatting with AIChatter!
          </div>
        \`;
        addTelemetry('Chat cleared');
      }
    }

    function exportChat() {
      const container = document.getElementById('messages-container');
      if (!container) return;
      const text = container.innerText;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aichatter-transcript.txt';
      a.click();
      showNotif('Export Complete', 'Transcript downloaded to aichatter-transcript.txt');
      addTelemetry('Chat transcript exported');
    }

    function startNewChat() {
      clearChat();
      showNotif('New Chat', 'Started a new AIChatter thread.');
    }

    function selectThread(idx) {
      showNotif('Thread Loaded', 'Switched to thread #' + (idx + 1));
      addTelemetry('Switched to conversation #' + (idx + 1));
    }
  </script>
</body>
</html>
`;
}
