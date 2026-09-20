/**
 * Authentic AIChatter Studio Application Template Source Code
 * Used as the default project code inside the IDE editor and export packages.
 */

export const AI_CHATTER_APP_CODE = `import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Code2, Copy, Check, Terminal, 
  Trash2, Download, RefreshCw, Cpu, Layers, Play, Zap,
  MessageSquare, Shield, FolderOpen
} from 'lucide-react';

interface ChatEntry {
  id: string;
  sender: 'ai' | 'user';
  model?: string;
  text: string;
  codeSnippet?: string;
  codeLang?: string;
  timestamp: string;
}

export default function App() {
  const [activeModel, setActiveModel] = useState('Gemini 3.8 Flash');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [tokenCount, setTokenCount] = useState(1482);
  const [temperature, setTemperature] = useState(0.7);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      model: 'Gemini 3.8 Flash',
      text: 'Welcome to **AIChatter Desktop Studio**! I am your AI companion for software engineering, design systems, and rapid prototyping. How can I help you today?',
      codeSnippet: \`// AIChatter Native Runtime
import { app, BrowserWindow } from 'electron';
console.log('AIChatter Studio initialized.');\`,
      codeLang: 'typescript',
      timestamp: '12:00 PM',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).electronAPI) {
      setIsElectron(true);
      addLog('Electron IPC Bridge connected to native OS.');
    } else {
      addLog('AIChatter Web Engine running in browser sandbox.');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const addLog = (msg: string) => {
    setTelemetryLogs((prev) => [new Date().toLocaleTimeString() + ' - ' + msg, ...prev.slice(0, 5)]);
  };

  const handleSend = () => {
    if (!inputPrompt.trim() || isThinking) return;
    const text = inputPrompt.trim();
    setInputPrompt('');

    const userEntry: ChatEntry = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setIsThinking(true);
    addLog('Prompt sent to ' + activeModel);

    setTimeout(() => {
      setIsThinking(false);
      let reply = 'Here is the analysis and implementation for: "' + text + '"';
      let code: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('react') || lower.includes('ui') || lower.includes('tailwind')) {
        reply = 'Here is a modern responsive React component styled with Tailwind CSS:';
        code = \`export function Card({ title }: { title: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
      <h3 className="font-bold text-white text-sm">{title}</h3>
      <p className="text-xs text-slate-400 mt-1">Responsive card component.</p>
    </div>
  );
}\`;
      } else if (lower.includes('window') || lower.includes('exe') || lower.includes('launcher')) {
        reply = 'Here is how AIChatter compiles native Windows launchers:';
        code = \`// launcher_source.c
#include <windows.h>
int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmd, int nShow) {
    ShellExecuteA(NULL, "open", "chrome.exe", "--app=\\\\\\"file:///C:/AIChatter/index.html\\\\\\"", NULL, SW_SHOWNORMAL);
    return 0;
}\`;
      } else {
        reply = 'Processed prompt through AIChatter inference stream with ' + activeModel + '.';
        code = \`// Inference metadata
const response = {
  model: '\${activeModel}',
  tokens: 215,
  latencyMs: 14
};\`;
      }

      setTokenCount((c) => c + 150);

      const aiEntry: ChatEntry = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        model: activeModel,
        text: reply,
        codeSnippet: code,
        codeLang: 'typescript',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiEntry]);
      addLog('Response rendered (' + activeModel + ')');
    }, 700);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'm-' + Date.now(),
        sender: 'ai',
        model: activeModel,
        text: 'Conversation cleared. What would you like to build next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    addLog('Chat cleared');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* App Header */}
      <header className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">AIChatter Studio</h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isElectron ? 'Desktop Native' : 'Web Runtime'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400">Model:</span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-transparent text-amber-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="Gemini 3.8 Flash" className="bg-slate-900">Gemini 3.8 Flash</option>
              <option value="Gemini 2.5 Pro" className="bg-slate-900">Gemini 2.5 Pro</option>
              <option value="Claude 3.7 Sonnet" className="bg-slate-900">Claude 3.7 Sonnet</option>
              <option value="DeepSeek R1" className="bg-slate-900">DeepSeek R1</option>
            </select>
          </div>

          <button
            onClick={handleClear}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={\`flex items-start gap-3 max-w-3xl \${
                  m.sender === 'user' ? 'ml-auto justify-end' : ''
                }\`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-md shadow-amber-500/20">
                    AI
                  </div>
                )}

                <div
                  className={\`rounded-2xl p-4 text-xs leading-relaxed max-w-xl shadow-lg \${
                    m.sender === 'user'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }\`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{m.sender === 'user' ? 'You' : 'AIChatter'}</span>
                      {m.model && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {m.model}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400">{m.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {m.codeSnippet && (
                    <div className="mt-3 rounded-xl bg-black/60 border border-slate-800 overflow-hidden font-mono text-[11px]">
                      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
                        <span>{m.codeLang || 'typescript'}</span>
                        <button
                          onClick={() => handleCopy(m.id, m.codeSnippet!)}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 text-amber-300 overflow-x-auto select-all">
                        <code>{m.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    U
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-start gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1">
                  AI
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>AIChatter is generating response with {activeModel}...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AIChatter anything... (press Enter to send)"
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={handleSend}
                disabled={isThinking || !inputPrompt.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Settings & Telemetry */}
        <aside className="w-64 bg-slate-900 border-l border-slate-800 p-4 space-y-4 flex flex-col justify-between hidden lg:flex text-xs">
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-white">Inference Engine</h3>

            <div className="space-y-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                  <span>Temperature:</span>
                  <span className="font-mono text-amber-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                <span>Tokens Used:</span>
                <span className="text-amber-300 font-bold">{tokenCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">IPC Telemetry</div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 max-h-36 overflow-y-auto">
                {telemetryLogs.map((log, i) => (
                  <div key={i} className="border-l border-amber-500/40 pl-1.5 text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>AIChatter v2.5</span>
            <span className="text-emerald-400">Connected</span>
          </div>
        </aside>
      </div>
    </div>
  );
}`;

export const AI_CHATTER_ELECTRON_MAIN = `/**
 * Electron Desktop Main Process
 * AIChatter Desktop Studio Engine
 */
const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, Notification } = require('electron');
const path = require('path');

let mainWindow = null;
let appTray = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: 'AIChatter - Desktop AI Studio',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#020617',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
  mainWindow.loadURL(devUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (Notification.isSupported()) {
      new Notification({
        title: 'AIChatter Ready',
        body: 'Gemini 3.8 Flash model pipeline and Windows runtime online.',
      }).show();
    }
  });

  // Native Application Menu Setup
  const menuTemplate = [
    {
      label: 'AIChatter',
      submenu: [
        { label: 'About AIChatter', role: 'about' },
        { type: 'separator' },
        { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => sendIPC('menu:preferences') },
        { type: 'separator' },
        { label: 'Quit AIChatter', role: 'quit' }
      ]
    },
    {
      label: 'Conversation',
      submenu: [
        { label: 'New Chat Thread', accelerator: 'CmdOrCtrl+N', click: () => sendIPC('menu:new') },
        { label: 'Open Saved Thread...', accelerator: 'CmdOrCtrl+O', click: handleFileOpen },
        { label: 'Export Transcript...', accelerator: 'CmdOrCtrl+S', click: () => sendIPC('menu:save') },
        { type: 'separator' },
        { label: 'Clear Messages', accelerator: 'CmdOrCtrl+K', click: () => sendIPC('menu:clear') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function sendIPC(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select AIChatter Thread',
    filters: [
      { name: 'JSON Conversations', extensions: ['json', 'txt', 'md'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!canceled && filePaths.length > 0) {
    sendIPC('chat:file-opened', filePaths[0]);
  }
}

// IPC Channel Handlers
ipcMain.handle('dialog:openConversation', handleFileOpen);

ipcMain.handle('system:getHardwareStats', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };
});

ipcMain.on('notify:show', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});`;

export const AI_CHATTER_ELECTRON_PRELOAD = `/**
 * Electron Preload Script - Secure Context Isolation Bridge
 * AIChatter Studio
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  openConversation: () => ipcRenderer.invoke('dialog:openConversation'),
  getHardwareStats: () => ipcRenderer.invoke('system:getHardwareStats'),
  showNotification: (title, body) => ipcRenderer.send('notify:show', { title, body }),
  onMenuTrigger: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('menu:action', handler);
    return () => ipcRenderer.removeListener('menu:action', handler);
  }
});`;
