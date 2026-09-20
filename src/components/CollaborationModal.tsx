import React, { useState } from 'react';
import { 
  X, Users, UserPlus, Mail, Shield, Check, Copy, 
  Circle, Radio, Send, Sparkles, MessageSquare 
} from 'lucide-react';
import { Project, TeamMember } from '../types';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onInviteMember: (member: Partial<TeamMember>) => void;
  onSendTeamChat: (messageText: string) => void;
  teamChatMessages: { id: string; sender: string; text: string; time: string }[];
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  project,
  onInviteMember,
  onSendTeamChat,
  teamChatMessages,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Editor' | 'Reviewer' | 'Viewer'>('Editor');
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    onInviteMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&w=120&q=80`,
      isOnline: true,
      color: ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)],
    });

    setInviteEmail('');
    setInviteName('');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendTeamChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Real-Time Team Collaboration</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live WebSocket
                </span>
              </div>
              <p className="text-xs text-slate-400">Concurrent code editing, live presence & team chat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Team Members & Invite */}
          <div className="w-1/2 border-r border-slate-800 flex flex-col overflow-hidden">
            {/* Invite Form */}
            <form onSubmit={handleInvite} className="p-3.5 border-b border-slate-800 bg-slate-950/60 space-y-2.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">INVITE COLLABORATOR</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Full Name"
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Editor">Editor</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite
                </button>
              </div>

              {copiedInvite && (
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Invite generated and added to project session!
                </div>
              )}
            </form>

            {/* Team Roster List */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase px-1">
                Active Team Members ({project.collaborators.length})
              </div>

              {project.collaborators.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border-2"
                        style={{ borderColor: member.color }}
                      />
                      {member.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{member.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {member.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{member.email}</div>
                    </div>
                  </div>

                  {member.currentFile && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-amber-400/90 block truncate max-w-[100px]">
                        {member.currentFile.replace('src/', '')}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {member.isOnline ? 'Active' : 'Away'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Team Chat Feed */}
          <div className="w-1/2 flex flex-col bg-slate-950/80">
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Session Team Chat & Activity Feed</span>
            </div>

            {/* Chat message list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
              {teamChatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-200">{msg.sender}</span>
                    <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-900/60 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast note to team..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
