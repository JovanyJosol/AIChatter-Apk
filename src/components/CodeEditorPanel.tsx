import React, { useState } from 'react';
import { 
  FileCode, Folder, Copy, Check, Plus, Code2, 
  Save, Sparkles, Terminal, FileJson, FileText, ChevronRight
} from 'lucide-react';
import { Project, ProjectFile, CodeSnippet } from '../types';

interface CodeEditorPanelProps {
  project: Project;
  onUpdateFileContent: (path: string, content: string) => void;
  onApplySnippet: (snippet: CodeSnippet) => void;
  snippets: CodeSnippet[];
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  project,
  onUpdateFileContent,
  onApplySnippet,
  snippets,
}) => {
  const [activeFilePath, setActiveFilePath] = useState(project.activeFilePath || 'src/App.tsx');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const currentFile = project.files.find((f) => f.path === activeFilePath) || project.files[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.cjs')) {
      return <FileCode className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Find collaborators currently on this file
  const activeCollaborators = project.collaborators.filter(
    (c) => c.currentFile === activeFilePath && c.isOnline
  );

  return (
    <div className="flex h-full bg-slate-950 text-slate-200 select-none overflow-hidden">
      {/* File Tree Sidebar */}
      <div className="w-56 border-r border-slate-800/80 bg-slate-900/40 flex flex-col">
        <div className="p-3 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Project Workspace</span>
          <span className="text-[10px] text-slate-500 font-semibold">{project.files.length} files</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Folder className="w-3 h-3 text-amber-400" />
            <span>Root Repository</span>
          </div>

          {project.files.map((file) => {
            const isSelected = file.path === activeFilePath;
            const editorOnThisFile = project.collaborators.find((c) => c.currentFile === file.path && c.isOnline);

            return (
              <button
                key={file.path}
                onClick={() => setActiveFilePath(file.path)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </div>

                {editorOnThisFile && (
                  <span
                    className="w-2 h-2 rounded-full ring-1 ring-slate-950"
                    style={{ backgroundColor: editorOnThisFile.color }}
                    title={`${editorOnThisFile.name} is editing`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Rapid Snippets Shelf in Sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-2">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3" />
              Prototyping Snippets
            </span>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {snippets.map((snip) => (
              <div
                key={snip.id}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs"
              >
                <div className="flex items-center justify-between font-semibold text-slate-200 text-[11px]">
                  <span className="truncate">{snip.title}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyCode(snip.id, snip.code)}
                      className="text-slate-400 hover:text-white p-0.5"
                      title="Copy code"
                    >
                      {copiedSnippetId === snip.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => onApplySnippet(snip)}
                      className="text-amber-400 hover:text-amber-300 p-0.5"
                      title="Insert snippet into code"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{snip.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Main Stage */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Tabs & Save Status */}
        <div className="h-10 border-b border-slate-800 bg-slate-950 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-t-2 border-amber-400 text-xs font-mono text-white rounded-t-md">
              {getFileIcon(currentFile.name)}
              <span>{currentFile.name}</span>
            </div>

            {/* Collaborator Editing Callout */}
            {activeCollaborators.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeCollaborators[0].name} is collaborating</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {saveToast && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved to workspace
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              Save
            </button>
          </div>
        </div>

        {/* Code View with Line Numbers */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs bg-slate-950">
          {/* Line Numbers Bar */}
          <div className="w-12 py-3 bg-slate-950/80 border-r border-slate-800/80 text-right pr-3 text-slate-600 select-none font-mono text-[11px] overflow-hidden leading-relaxed">
            {currentFile.content.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>

          {/* Interactive Text Area Editor */}
          <textarea
            value={currentFile.content}
            onChange={(e) => onUpdateFileContent(currentFile.path, e.target.value)}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent text-slate-200 focus:outline-none resize-none font-mono text-xs leading-relaxed overflow-auto selection:bg-amber-500/30 selection:text-white"
          />
        </div>

        {/* Editor Footer / Telemetry */}
        <div className="h-6 border-t border-slate-800 bg-slate-950 px-3 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <div className="flex items-center gap-3">
            <span>Path: {currentFile.path}</span>
            <span>Encoding: UTF-8</span>
            <span>Lines: {currentFile.content.split('\n').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400/80">Vite 8 & Electron 34 Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
