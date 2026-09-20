import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Code2, Copy, Check, Terminal, 
  Layers, Play, Plus, RefreshCw, Cpu, Monitor, Zap, MessageSquare
} from 'lucide-react';
import { ChatMessage, CodeSnippet, ProjectType } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onApplySnippet: (snippet: CodeSnippet) => void;
  onApplyCodePatch: (path: string, content: string) => void;
  isAiThinking: boolean;
  targetType: ProjectType;
  onChangeTargetType: (type: ProjectType) => void;
}

const PROMPT_SUGGESTIONS = [
  'Add intelligent code generation stream with Gemini 3.8 Flash',
  'Integrate native Electron Tray menu and Windows notifications',
  'Generate 4K ambient studio wallpaper in Media Manager',
  'Add local conversation history & thread persistence',
  'Add dark glassmorphism card styling with high contrast',
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onApplySnippet,
  onApplyCodePatch,
  isAiThinking,
  targetType,
  onChangeTargetType,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAiThinking) return;
    const prompt = inputValue.trim();
    setInputValue('');
    onSendMessage(prompt);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 text-slate-200 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">AI Chatter Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Natural language app & desktop synthesizer</p>
          </div>
        </div>

        {/* Target Switcher */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
          <button
            onClick={() => onChangeTargetType('electron-desktop')}
            className={`px-2 py-0.5 rounded transition-all ${
              targetType === 'electron-desktop'
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Electron
          </button>
          <button
            onClick={() => onChangeTargetType('web-react')}
            className={`px-2 py-0.5 rounded transition-all ${
              targetType === 'web-react'
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            React
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-mono text-slate-400">
                {msg.sender === 'user' ? 'You' : 'AI Chatter'}
              </span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[92%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              {/* Message text with basic markdown parsing */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.content}
              </div>

              {/* Attached Code Snippets */}
              {msg.snippets && msg.snippets.length > 0 && (
                <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-semibold">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Rapid Prototyping Snippets</span>
                  </div>

                  {msg.snippets.map((snip) => (
                    <div
                      key={snip.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 overflow-hidden text-slate-300"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white text-[11px]">{snip.title}</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                            {snip.language}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyCode(snip.id, snip.code)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                            title="Copy snippet"
                          >
                            {copiedSnippetId === snip.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => onApplySnippet(snip)}
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-medium transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Insert
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 mb-2">{snip.description}</p>

                      <pre className="p-2 rounded-lg bg-black/50 border border-slate-800/60 font-mono text-[10px] overflow-x-auto text-emerald-300/90 leading-tight">
                        {snip.code}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Next Actions */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(action)}
                      className="px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 text-amber-400" />
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
              <RefreshCw className="w-3 h-3" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-3.5 py-2 text-slate-300 flex items-center gap-2">
              <span>Synthesizing code architecture & snippets...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Rapid Prompts Shelf */}
      <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {PROMPT_SUGGESTIONS.map((promptText, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(promptText)}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-amber-300 text-[11px] transition-all inline-flex items-center gap-1 flex-shrink-0"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            {promptText}
          </button>
        ))}
      </div>

      {/* Prompt Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="relative flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Ask AI Chatter to build ${targetType === 'electron-desktop' ? 'an Electron desktop app' : 'a React web app'}... (e.g. "Add native menu bar and MIDI controls")`}
            rows={2}
            className="w-full pl-3 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none transition-all"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isAiThinking}
            className={`absolute right-2 p-2 rounded-lg transition-all ${
              inputValue.trim() && !isAiThinking
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono px-1">
          <span>Press Enter to send · Shift+Enter for new line</span>
          <span className="text-amber-400/80">⚡ Real-time preview auto-updates</span>
        </div>
      </form>
    </div>
  );
};
