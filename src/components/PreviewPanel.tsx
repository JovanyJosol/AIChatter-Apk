import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, Minimize2, RotateCw, Monitor, Smartphone, 
  Tablet, Laptop, ExternalLink, Terminal, Shield, FolderOpen,
  Sparkles, X, Minus, Square, Send, Copy, Check, Play,
  Bot, User, MessageSquare, Download, Trash2, Cpu
} from 'lucide-react';
import { Project, ProjectType } from '../types';

interface PreviewPanelProps {
  project: Project;
  onCodeChange?: (newCode: string) => void;
  onTriggerIPC?: (channel: string, payload?: any) => void;
}

interface ChatEntry {
  id: string;
  sender: 'ai' | 'user';
  model?: string;
  text: string;
  codeSnippet?: string;
  codeLang?: string;
  timestamp: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  project,
  onTriggerIPC,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [showNativeMenu, setShowNativeMenu] = useState(true);
  const [openMenuCategory, setOpenMenuCategory] = useState<string | null>(null);
  const [nativeNotification, setNativeNotification] = useState<{ title: string; body: string } | null>(null);
  const [showIpcFileDialog, setShowIpcFileDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Active AI Model and Settings
  const [activeModel, setActiveModel] = useState('Gemini 3.8 Flash');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [activePersona, setActivePersona] = useState('Full-Stack Software Architect');
  const [tokenUsage, setTokenUsage] = useState(1482);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Conversations in AIChatter
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const [threads, setThreads] = useState([
    { id: 't1', title: '⚡ Full-Stack Code & Windows IPC', time: 'Active' },
    { id: 't2', title: '🎨 Modern Tailwind UI & Design', time: '1h ago' },
    { id: 't3', title: '🤖 Prompt Engineering & Reasoning', time: 'Yesterday' },
  ]);

  // Chat messages
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      model: 'Gemini 3.8 Flash',
      text: 'Welcome to **AIChatter Desktop Studio**! I am your AI assistant specialized in full-stack architecture, Windows desktop tooling, and high-performance React design. How can I assist you today?',
      codeSnippet: `// AIChatter Native IPC initialized
import { app, BrowserWindow, ipcMain } from 'electron';
console.log('AIChatter engine running with Gemini 3.8 Flash');`,
      codeLang: 'typescript',
      timestamp: '12:00 PM',
    },
  ]);

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    'Preview Sandbox ready',
    project.type === 'electron-desktop' ? 'AIChatter Native IPC exposed to window.electronAPI' : 'Vite React 19 mounted',
    'Gemini 3.8 Flash ultra-low latency model stream online',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const addLog = (msg: string) => {
    setSimulatedLogs((prev) => [new Date().toLocaleTimeString() + ' - ' + msg, ...prev.slice(0, 5)]);
  };

  const showSimulatedNotification = (title: string, body: string) => {
    setNativeNotification({ title, body });
    setTimeout(() => setNativeNotification(null), 4000);
  };

  const handleTriggerMenuAction = (action: string) => {
    setOpenMenuCategory(null);
    addLog(`Menu action triggered: ${action}`);
    if (action === 'openFile') {
      setShowIpcFileDialog(true);
    } else if (action === 'notify') {
      showSimulatedNotification('AIChatter Notification', 'Workspace state synced to local storage.');
    } else if (action === 'save') {
      showSimulatedNotification('Conversation Saved', 'Chat session exported to disk.');
    } else if (action === 'clear') {
      handleClearChat();
    }
  };

  const handleSendMessage = () => {
    if (!inputPrompt.trim() || isAiThinking) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: ChatEntry = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsAiThinking(true);
    addLog(`Sent prompt to ${activeModel}: "${userText.slice(0, 32)}..."`);

    // Simulate intelligent AI response
    setTimeout(() => {
      setIsAiThinking(false);

      let replyText = `I have analyzed your inquiry regarding "${userText}". Here is the solution optimized for AIChatter:`;
      let snippet: string | undefined = undefined;
      let lang = 'typescript';

      const lower = userText.toLowerCase();
      if (lower.includes('window') || lower.includes('exe') || lower.includes('launcher') || lower.includes('c')) {
        replyText = `Here is how the native Windows launcher launches your application directly in Chromium app mode:`;
        snippet = `// launcher_source.c
#include <windows.h>
int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmd, int nShow) {
    ShellExecuteA(NULL, "open", "chrome.exe", "--app=\\"file:///C:/AIChatter/index.html\\"", NULL, SW_SHOWNORMAL);
    return 0;
}`;
        lang = 'c';
      } else if (lower.includes('react') || lower.includes('ui') || lower.includes('tailwind')) {
        replyText = `Here is a modern responsive React component styled with Tailwind CSS:`;
        snippet = `export function QuickCard({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-bold text-white">{title}</span>
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">{badge}</span>
      </div>
      <p className="text-xs text-slate-400">AIChatter responsive component template.</p>
    </div>
  );
}`;
      } else {
        replyText = `AIChatter processed: "${userText}". All parameters conform to persona: ${activePersona}. Temperature is set to ${temperature}.`;
        snippet = `// Response Generated by ${activeModel}
const state = {
  status: 'online',
  latencyMs: 14,
  tokensGenerated: 248,
};`;
      }

      setTokenUsage((prev) => prev + Math.floor(userText.length / 3) + 140);

      const aiReply: ChatEntry = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        model: activeModel,
        text: replyText,
        codeSnippet: snippet,
        codeLang: lang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
      addLog(`Response generated by ${activeModel}`);
    }, 700);
  };

  const handleCopySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        model: activeModel,
        text: 'Chat history cleared. How can I help you next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    addLog('Chat conversation cleared');
  };

  const handleExportChat = () => {
    const textContent = messages.map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}\n${m.codeSnippet ? m.codeSnippet + '\n' : ''}`).join('\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aichatter-conversation.txt';
    a.click();
    showSimulatedNotification('Exported', 'Conversation transcript downloaded.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 text-slate-200 select-none overflow-hidden relative">
      {/* Top Controls Toolbar */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 px-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME PREVIEW</span>
          </div>

          <span className="text-slate-600 text-xs">|</span>

          {/* Viewport Width Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-slate-400">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1 rounded transition-all ${viewport === 'desktop' ? 'bg-slate-800 text-amber-300' : 'hover:text-slate-200'}`}
              title="Desktop View (1240px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('laptop')}
              className={`p-1 rounded transition-all ${viewport === 'laptop' ? 'bg-slate-800 text-amber-300' : 'hover:text-slate-200'}`}
              title="Laptop View (1024px)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1 rounded transition-all ${viewport === 'tablet' ? 'bg-slate-800 text-amber-300' : 'hover:text-slate-200'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1 rounded transition-all ${viewport === 'mobile' ? 'bg-slate-800 text-amber-300' : 'hover:text-slate-200'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-slate-600 text-xs">|</span>

          <button
            onClick={() => {
              setRefreshKey((k) => k + 1);
              addLog('Preview re-rendered');
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Info & Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Vite 8 + React 19</span>
          </div>

          <button
            onClick={() => setIsWindowMaximized(!isWindowMaximized)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
            title={isWindowMaximized ? 'Restore Viewport' : 'Maximize Viewport'}
          >
            {isWindowMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview Stage / Screen */}
      <div className="flex-1 bg-slate-950/90 p-4 md:p-6 flex items-center justify-center overflow-auto relative">
        {/* Simulated OS Notification Popup */}
        {nativeNotification && (
          <div className="absolute top-8 right-8 z-50 bg-slate-900 border border-amber-500/50 shadow-2xl rounded-xl p-3 max-w-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200 text-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{nativeNotification.title}</div>
              <div className="text-slate-400 text-[11px] mt-0.5">{nativeNotification.body}</div>
            </div>
          </div>
        )}

        {/* Simulated IPC File Dialog Modal */}
        {showIpcFileDialog && (
          <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  Electron dialog:openFile
                </span>
                <button onClick={() => setShowIpcFileDialog(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
              <p className="text-slate-300 text-xs">Simulated native file dialog for AIChatter conversations.</p>
              <div className="p-2 rounded-lg bg-black/50 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="p-1 rounded bg-slate-800/80 cursor-pointer hover:bg-slate-800">📄 conversation-archived.json</div>
                <div className="p-1 rounded bg-slate-800/80 cursor-pointer hover:bg-slate-800">📄 system-prompt-expert.md</div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowIpcFileDialog(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Viewport Frame Container */}
        <div
          key={refreshKey}
          className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl flex flex-col border ${
            project.type === 'electron-desktop'
              ? 'bg-slate-950 border-slate-700/80 shadow-black/80'
              : 'bg-slate-900 border-slate-800 shadow-slate-950'
          } ${
            isWindowMaximized
              ? 'w-full h-full'
              : viewport === 'desktop'
              ? 'w-full max-w-[1240px] h-[780px]'
              : viewport === 'laptop'
              ? 'w-full max-w-[1024px] h-[640px]'
              : viewport === 'tablet'
              ? 'w-[768px] h-[700px]'
              : 'w-[375px] h-[667px]'
          }`}
        >
          {/* Electron Desktop Native Window Chrome */}
          <div className="h-9 bg-slate-900/90 border-b border-slate-800/90 px-3 flex items-center justify-between select-none">
            {/* Window Traffic Lights */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 hover:brightness-125 cursor-pointer flex items-center justify-center group">
                  <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
                </span>
                <span className="w-3 h-3 rounded-full bg-amber-500/90 hover:brightness-125 cursor-pointer flex items-center justify-center group">
                  <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 hover:brightness-125 cursor-pointer flex items-center justify-center group">
                  <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100" />
                </span>
              </div>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              {/* Native OS Menubar Simulator */}
              <div className="relative flex items-center gap-3 text-[11px] text-slate-300 font-medium">
                {['File', 'Edit', 'Model', 'View', 'Help'].map((cat) => (
                  <div key={cat} className="relative">
                    <button
                      onClick={() => setOpenMenuCategory(openMenuCategory === cat ? null : cat)}
                      className={`px-1.5 py-0.5 rounded hover:bg-slate-800 transition-all ${
                        openMenuCategory === cat ? 'bg-slate-800 text-white' : ''
                      }`}
                    >
                      {cat}
                    </button>

                    {/* Dropdown for category */}
                    {openMenuCategory === cat && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-1 z-50 text-xs">
                        {cat === 'File' && (
                          <>
                            <button
                              onClick={() => handleTriggerMenuAction('openFile')}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-500/20 text-slate-200 flex justify-between items-center"
                            >
                              <span>Open Thread...</span>
                              <span className="font-mono text-[10px] text-slate-500">⌘O</span>
                            </button>
                            <button
                              onClick={() => handleTriggerMenuAction('save')}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-500/20 text-slate-200 flex justify-between items-center"
                            >
                              <span>Save Chat</span>
                              <span className="font-mono text-[10px] text-slate-500">⌘S</span>
                            </button>
                            <button
                              onClick={() => handleTriggerMenuAction('clear')}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-500/20 text-rose-300 flex justify-between items-center"
                            >
                              <span>Clear Chat</span>
                              <span className="font-mono text-[10px] text-slate-500">⌘K</span>
                            </button>
                          </>
                        )}
                        {cat === 'Model' && (
                          <>
                            {['Gemini 3.8 Flash', 'Gemini 2.5 Pro', 'Claude 3.7 Sonnet', 'DeepSeek R1'].map((m) => (
                              <button
                                key={m}
                                onClick={() => {
                                  setActiveModel(m);
                                  setOpenMenuCategory(null);
                                  showSimulatedNotification('Model Switched', `Engine set to ${m}`);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-500/20 text-slate-200 flex items-center justify-between"
                              >
                                <span>{m}</span>
                                {activeModel === m && <Check className="w-3 h-3 text-amber-400" />}
                              </button>
                            ))}
                          </>
                        )}
                        {cat !== 'File' && cat !== 'Model' && (
                          <div className="p-2 text-[10px] text-slate-400">
                            Native Electron menu handler active.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Centered App Title */}
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-white font-bold">AIChatter Desktop Studio</span>
              <span className="text-[10px] font-mono text-slate-500">— Windows x64</span>
            </div>

            {/* Engine Status Badge */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeModel}</span>
            </div>
          </div>

          {/* RENDERED LIVE AICHATTER APPLICATION INTERFACE */}
          <div className="flex-1 overflow-hidden bg-slate-950 flex">
            
            {/* AIChatter Left Thread Sidebar */}
            <div className="w-60 bg-slate-900/90 border-r border-slate-800/80 p-3 flex flex-col justify-between hidden md:flex">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleClearChat();
                    showSimulatedNotification('New Thread', 'Started fresh conversation');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>+</span>
                  <span>New Chat</span>
                </button>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 font-bold mb-1">
                    Threads
                  </div>
                  {threads.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveThreadIndex(idx)}
                      className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                        activeThreadIndex === idx
                          ? 'bg-slate-800 text-white border-slate-700 font-medium'
                          : 'hover:bg-slate-800/50 text-slate-400 border-transparent'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 flex-shrink-0 ml-1">{t.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Diagnostics */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Tokens:</span>
                  <span className="text-amber-300 font-bold">{tokenUsage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className="text-emerald-400">12 ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Storage:</span>
                  <span className="text-slate-300">IndexedDB</span>
                </div>
              </div>
            </div>

            {/* Main Chat Stream Deck */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* Chat Header Toolbar */}
              <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">Model:</span>
                  <select
                    value={activeModel}
                    onChange={(e) => {
                      setActiveModel(e.target.value);
                      showSimulatedNotification('Model Updated', `Switched to ${e.target.value}`);
                    }}
                    className="bg-slate-950 border border-slate-700 text-amber-300 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="Gemini 3.8 Flash">Gemini 3.8 Flash (Fastest)</option>
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Reasoning)</option>
                    <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (Coding)</option>
                    <option value="DeepSeek R1">DeepSeek R1 (Open Logic)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearChat}
                    className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={handleExportChat}
                    className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Starter Quick Prompt Pills */}
              <div className="px-4 py-1.5 bg-slate-950/60 border-b border-slate-800/40 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
                <span className="text-slate-500 font-mono text-[10px] font-bold uppercase">Prompts:</span>
                <button
                  onClick={() => setInputPrompt('Explain native Windows C launcher with Chromium app mode')}
                  className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-[11px] transition-colors"
                >
                  ⚡ Windows Launcher Architecture
                </button>
                <button
                  onClick={() => setInputPrompt('Generate a responsive React 19 card with Tailwind')}
                  className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-[11px] transition-colors"
                >
                  🎨 React 19 UI Card
                </button>
                <button
                  onClick={() => setInputPrompt('Show Electron preload contextBridge IPC pattern')}
                  className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-[11px] transition-colors"
                >
                  🔒 Secure Electron IPC
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 max-w-3xl ${
                      m.sender === 'user' ? 'ml-auto justify-end' : ''
                    }`}
                  >
                    {m.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-md shadow-amber-500/20">
                        AI
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed max-w-xl shadow-lg ${
                        m.sender === 'user'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      }`}
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
                          <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-slate-400 text-[10px]">
                            <span>{m.codeLang || 'typescript'}</span>
                            <button
                              onClick={() => handleCopySnippet(m.id, m.codeSnippet!)}
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

                {isAiThinking && (
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

              {/* Chat Input Bar */}
              <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask AIChatter anything... (press Enter to send)"
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isAiThinking || !inputPrompt.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Quick Settings & Telemetry Sidebar */}
            <div className="w-64 bg-slate-900 border-l border-slate-800 p-3.5 space-y-4 flex flex-col justify-between hidden lg:flex text-xs">
              <div className="space-y-4">
                <div>
                  <div className="font-bold text-white uppercase tracking-wider font-mono text-[11px] mb-0.5">
                    Model Parameters
                  </div>
                  <p className="text-[10px] text-slate-400">AIChatter Studio active configuration</p>
                </div>

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

                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1 font-semibold">
                      <span>Max Response:</span>
                      <span className="font-mono text-amber-400">{maxTokens} tokens</span>
                    </div>
                    <input
                      type="range"
                      min="1024"
                      max="8192"
                      step="512"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-mono uppercase text-slate-400 text-[10px] font-bold">Persona</div>
                  <select
                    value={activePersona}
                    onChange={(e) => setActivePersona(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option>Full-Stack Software Architect</option>
                    <option>Rapid Prototyper & UI Designer</option>
                    <option>Security & Performance Auditor</option>
                    <option>Creative Technical Writer</option>
                  </select>
                </div>

                {/* Sandbox Console Stream */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>SANDBOX TELEMETRY</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 max-h-36 overflow-y-auto">
                    {simulatedLogs.map((log, i) => (
                      <div key={i} className="border-l border-amber-500/40 pl-1.5 text-slate-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>AIChatter.exe</span>
                <span className="text-amber-400 font-semibold">Ready</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
