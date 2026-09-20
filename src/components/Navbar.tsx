import React, { useState } from 'react';
import { 
  Terminal, Sparkles, GitBranch, GitCommit, Users, 
  Download, Image as ImageIcon, Globe, ChevronDown, Check,
  Monitor, Layout, Laptop
} from 'lucide-react';
import { Project, ProjectType, TeamMember, SubscriptionPlanId } from '../types';

interface NavbarProps {
  project: Project;
  onSelectProjectType: (type: ProjectType) => void;
  onOpenVersionControl: () => void;
  onOpenCollaboration: () => void;
  onOpenSubscription: () => void;
  onOpenMediaManager: () => void;
  onOpenExport: () => void;
  currentPlan: SubscriptionPlanId;
  hasUncommittedChanges: boolean;
  activeView: 'split' | 'chat' | 'code' | 'preview';
  onChangeActiveView: (view: 'split' | 'chat' | 'code' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onSelectProjectType,
  onOpenVersionControl,
  onOpenCollaboration,
  onOpenSubscription,
  onOpenMediaManager,
  onOpenExport,
  currentPlan,
  hasUncommittedChanges,
  activeView,
  onChangeActiveView,
}) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const onlineCollaborators = project.collaborators.filter((c) => c.isOnline);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-orange-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 tracking-tight">AI Chatter Studio</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-semibold">
                v2.4 Pro
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Project Name & Target Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">{project.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-400 font-mono text-[11px]">
              {project.type === 'electron-desktop' ? 'Electron Desktop' : 'React Web'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTypeDropdown && (
            <div className="absolute top-full mt-1.5 left-0 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Select Prototyping Target
              </div>
              <button
                onClick={() => {
                  onSelectProjectType('electron-desktop');
                  setShowTypeDropdown(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                  project.type === 'electron-desktop'
                    ? 'bg-amber-500/10 text-amber-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-medium">Electron Desktop App</div>
                    <div className="text-[10px] text-slate-400">Native window, IPC, Tray, OS Menus</div>
                  </div>
                </div>
                {project.type === 'electron-desktop' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              <button
                onClick={() => {
                  onSelectProjectType('web-react');
                  setShowTypeDropdown(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all mt-1 ${
                  project.type === 'web-react'
                    ? 'bg-amber-500/10 text-amber-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="font-medium">React Web SPA</div>
                    <div className="text-[10px] text-slate-400">Vite, React 19, Tailwind CSS</div>
                  </div>
                </div>
                {project.type === 'web-react' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* View Switchers on Desktop */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs ml-2">
          <button
            onClick={() => onChangeActiveView('split')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'split' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split Workspace
          </button>
          <button
            onClick={() => onChangeActiveView('chat')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'chat' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Chatter
          </button>
          <button
            onClick={() => onChangeActiveView('code')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'code' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code & Snippets
          </button>
          <button
            onClick={() => onChangeActiveView('preview')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'preview' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Version Control Trigger */}
        <button
          onClick={onOpenVersionControl}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all relative"
          title="Git Version Control & Commits"
        >
          <GitBranch className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[11px]">{project.currentBranch}</span>
          {hasUncommittedChanges && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Uncommitted changes ready" />
          )}
        </button>

        {/* Media Assets Manager Trigger */}
        <button
          onClick={onOpenMediaManager}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all"
          title="AI Images & Veo Videos Asset Manager"
        >
          <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Media Assets</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
            {project.mediaAssets.length}
          </span>
        </button>

        {/* Collaborators Presence Facepile */}
        <button
          onClick={onOpenCollaboration}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all"
          title="Real-Time Team Collaboration"
        >
          <div className="flex -space-x-1.5 items-center">
            {project.collaborators.slice(0, 3).map((c) => (
              <div key={c.id} className="relative">
                <img
                  src={c.avatar}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full ring-2 ring-slate-950 object-cover"
                />
                {c.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-slate-950" />
                )}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {onlineCollaborators.length} online
          </span>
        </button>

        {/* Plus Go Pro Plan Pill */}
        <button
          onClick={onOpenSubscription}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            currentPlan === 'plus-go-pro' || currentPlan === 'enterprise'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/20'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>{currentPlan === 'plus-go-pro' ? 'Plus Go Pro' : currentPlan === 'enterprise' ? 'Enterprise' : 'Upgrade to Pro'}</span>
        </button>

        {/* Instant Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instant Export</span>
        </button>
      </div>
    </header>
  );
};
