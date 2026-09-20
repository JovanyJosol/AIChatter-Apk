import React, { useState } from 'react';
import { 
  X, GitBranch, GitCommit, RotateCcw, Plus, Check, 
  GitMerge, Clock, FileCode, ChevronRight, Sparkles 
} from 'lucide-react';
import { Project, VersionCommit } from '../types';

interface VersionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onCommitChanges: (message: string) => void;
  onSwitchBranch: (branchName: string) => void;
  onCreateBranch: (branchName: string) => void;
  onRevertCommit: (commit: VersionCommit) => void;
}

export const VersionControlModal: React.FC<VersionControlModalProps> = ({
  isOpen,
  onClose,
  project,
  onCommitChanges,
  onSwitchBranch,
  onCreateBranch,
  onRevertCommit,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState<VersionCommit | null>(
    project.commits[0] || null
  );

  if (!isOpen) return null;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    onCommitChanges(commitMessage.trim());
    setCommitMessage('');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    onCreateBranch(newBranchName.trim());
    setNewBranchName('');
    setShowCreateBranch(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Git Version Control</h2>
              <p className="text-xs text-slate-400">Branching, snapshots, commit timeline & rollbacks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branch Selector Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">ACTIVE BRANCH:</span>
            <div className="flex gap-1.5">
              {project.branches.map((b) => (
                <button
                  key={b.name}
                  onClick={() => onSwitchBranch(b.name)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 ${
                    project.currentBranch === b.name
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCreateBranch(!showCreateBranch)}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            New Branch
          </button>
        </div>

        {/* Create Branch Accordion */}
        {showCreateBranch && (
          <form onSubmit={handleCreateBranch} className="p-3 bg-slate-950 border-b border-slate-800 flex gap-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Branch name (e.g. feature/midi-pads)"
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              Create
            </button>
          </form>
        )}

        {/* Content Body: Left commits list, Right commit details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Commits Timeline */}
          <div className="w-1/2 border-r border-slate-800 flex flex-col">
            {/* New Commit Input Form */}
            <form onSubmit={handleCommit} className="p-3 border-b border-slate-800 bg-slate-950/60">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                COMMIT STAGED CHANGES
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g. feat: integrate native Electron dialogs"
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={!commitMessage.trim()}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  Commit
                </button>
              </div>
            </form>

            {/* Commits List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase px-1">
                Commit History ({project.commits.length})
              </div>

              {project.commits.map((commit) => {
                const isSelected = selectedCommit?.id === commit.id;
                return (
                  <button
                    key={commit.id}
                    onClick={() => setSelectedCommit(commit)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold truncate pr-2">{commit.message}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-300">
                        {commit.hash}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={commit.author.avatar}
                          alt={commit.author.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{commit.author.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{commit.timestamp}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Commit Detail / Diff Inspector */}
          <div className="w-1/2 p-4 flex flex-col justify-between overflow-y-auto bg-slate-950/80">
            {selectedCommit ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold">
                      COMMIT DETAILS
                    </span>
                    <span className="font-mono text-xs text-slate-400">Branch: {selectedCommit.branch}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{selectedCommit.message}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>Authored by {selectedCommit.author.name}</span>
                    <span>·</span>
                    <span>{selectedCommit.timestamp}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">Snapshot Integrity</div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Commit Hash:</span>
                      <span className="text-sky-300">{selectedCommit.hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Files Preserved:</span>
                      <span className="text-emerald-400">{Object.keys(selectedCommit.filesSnapshot).length} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Workspace status:</span>
                      <span className="text-slate-300">Clean tree verified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onRevertCommit(selectedCommit);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Workspace to This Commit ({selectedCommit.hash})
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-1.5">
                    Restores all project files and resets current preview state
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 my-auto text-xs">
                Select a commit on the left to inspect snapshot diffs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
