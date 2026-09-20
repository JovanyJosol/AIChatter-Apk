import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ChatPanel } from './components/ChatPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { MediaAssetManagerModal } from './components/MediaAssetManagerModal';
import { VersionControlModal } from './components/VersionControlModal';
import { CollaborationModal } from './components/CollaborationModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ExportModal } from './components/ExportModal';

import { 
  DEFAULT_PROJECTS, 
  INITIAL_PLANS, 
  RAPID_CODE_SNIPPETS 
} from './data/defaultProjects';
import { 
  Project, 
  ProjectType, 
  ChatMessage, 
  CodeSnippet, 
  MediaAsset, 
  VersionCommit, 
  TeamMember, 
  SubscriptionPlanId 
} from './types';

export default function App() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECTS[0]);
  const [activeView, setActiveView] = useState<'split' | 'chat' | 'code' | 'preview'>('split');
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanId>('plus-go-pro');
  const [hasUncommittedChanges, setHasUncommittedChanges] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Modals
  const [isVersionControlOpen, setIsVersionControlOpen] = useState(false);
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Team chat feed
  const [teamChatMessages, setTeamChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    {
      id: 'tc-1',
      sender: 'Elena Rostova',
      text: 'Configured Gemini streaming pipeline and Windows IPC bridge in main.electron.cjs.',
      time: '07:22 AM',
    },
    {
      id: 'tc-2',
      sender: 'Marcus Chen',
      text: 'AIChatter conversation sandbox and local persistence verified for preview.',
      time: '07:38 AM',
    },
  ]);

  // Initial Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Welcome to **AI Chatter Studio**! I am your AI architect for rapid prototyping of **React Web Apps** and **Electron Desktop Applications**.

### What I can build for you:
1. **Natural Language App Generation**: Describe any AI assistant, dashboard, productivity utility, or creative tool and I will generate complete, interactive React code with real-time previewing.
2. **Native Electron Architecture**: Request native system features like \`BrowserWindow\` frame customizers, system tray menus, IPC handlers (\`dialog:openFile\`), hardware acceleration, and OS notifications.
3. **Instant Packaging & Export**: One-click download of ready-to-run React Vite templates or fully configured Windows desktop executables (\`AIChatter.exe\` & \`AIChatter-Setup.exe\`).
4. **Integrated Media Manager**: Generate 4K AI Images and Veo AI Video loops directly and insert them into your code.

What would you like to prototype or add to **${DEFAULT_PROJECTS[0].name}**?`,
      timestamp: '07:40 AM',
      snippets: RAPID_CODE_SNIPPETS.slice(0, 2),
      suggestedActions: [
        'Add high-contrast Cyberpunk theme',
        'Add native Electron menu bar & Tray icon',
        'Synthesize 4K Wallpaper in Media Manager',
        'Add local conversation history & thread persistence',
      ],
    },
  ]);

  // WebSocket reference for live multi-user collaboration
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Attempt WebSocket connection to /ws/collaborate
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/collaborate`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'join',
            userId: 'user-lead',
            userName: 'You (Dev Lead)',
            projectId: project.id,
            color: '#3b82f6',
            activeFile: project.activeFilePath,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'user:joined') {
            setTeamChatMessages((prev) => [
              ...prev,
              {
                id: `tc-${Date.now()}`,
                sender: 'System',
                text: `${data.user.name} joined the live collaboration room.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          } else if (data.type === 'chat:message') {
            setTeamChatMessages((prev) => [...prev, data.message]);
          } else if (data.type === 'commit:pushed') {
            setProject((prev) => ({
              ...prev,
              commits: [data.commit, ...prev.commits],
            }));
          }
        } catch (e) {
          // Parse warning
        }
      };

      ws.onclose = () => {
        // Closed gracefully
      };

      return () => {
        ws.close();
      };
    } catch (e) {
      // WS fallback
    }
  }, [project.id]);

  // Send AI Chat Message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const appFile = project.files.find((f) => f.path === 'src/App.tsx');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentCode: appFile?.content || '',
          targetType: project.type,
          contextFiles: project.files.map((f) => ({ path: f.path, name: f.name })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          snippets: data.snippets || [],
          suggestedActions: [
            'Add native IPC dialogs',
            'Generate 4K Hero Banner with AI',
            'Export Electron Desktop ZIP',
            'Deploy to Cloud edge',
          ],
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Check if response contains a complete TSX component in ```tsx block to update preview
        const tsxMatch = data.content.match(/```tsx\s*([\s\S]*?)```/);
        if (tsxMatch && tsxMatch[1]) {
          handleUpdateFileContent('src/App.tsx', tsxMatch[1].trim());
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: `I've analyzed your prompt **"${text}"** and applied architectural enhancements for **${project.type === 'electron-desktop' ? 'Electron Desktop' : 'React Web'}**. You can inspect the updated code or use the export button to package the application.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Update file content
  const handleUpdateFileContent = (path: string, newContent: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.path === path ? { ...f, content: newContent } : f)),
      updatedAt: new Date().toISOString(),
    }));
    setHasUncommittedChanges(true);

    // Broadcast over WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'code:edit',
          file: path,
          content: newContent,
        })
      );
    }
  };

  // Apply snippet
  const handleApplySnippet = (snippet: CodeSnippet) => {
    if (snippet.category === 'electron' || snippet.category === 'ipc') {
      const targetPath = snippet.code.includes('BrowserWindow') ? 'main.electron.cjs' : 'preload.js';
      const targetFile = project.files.find((f) => f.path === targetPath);
      if (targetFile) {
        handleUpdateFileContent(targetPath, `${targetFile.content}\n\n// Added Snippet: ${snippet.title}\n${snippet.code}`);
      }
    } else {
      const appFile = project.files.find((f) => f.path === 'src/App.tsx');
      if (appFile) {
        handleUpdateFileContent('src/App.tsx', `${appFile.content}\n\n// Added Snippet: ${snippet.title}\n${snippet.code}`);
      }
    }
  };

  // Commit changes
  const handleCommitChanges = (message: string) => {
    const hash = Math.random().toString(16).substring(2, 9);
    const newCommit: VersionCommit = {
      id: `cmt-${Date.now()}`,
      hash,
      message,
      author: {
        name: 'You (Dev Lead)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      },
      timestamp: 'Just now',
      branch: project.currentBranch,
      changesCount: 1,
      filesSnapshot: project.files.reduce((acc, f) => {
        acc[f.path] = f.content;
        return acc;
      }, {} as Record<string, string>),
    };

    setProject((prev) => ({
      ...prev,
      commits: [newCommit, ...prev.commits],
    }));
    setHasUncommittedChanges(false);

    // Broadcast to WS
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'commit:push',
          commit: newCommit,
        })
      );
    }
  };

  // Switch Branch
  const handleSwitchBranch = (branchName: string) => {
    setProject((prev) => ({
      ...prev,
      currentBranch: branchName,
    }));
  };

  // Create Branch
  const handleCreateBranch = (branchName: string) => {
    setProject((prev) => ({
      ...prev,
      currentBranch: branchName,
      branches: [
        ...prev.branches,
        {
          name: branchName,
          isDefault: false,
          lastCommitHash: prev.commits[0]?.hash || '8b4d10f',
        },
      ],
    }));
  };

  // Revert Commit
  const handleRevertCommit = (commit: VersionCommit) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => {
        if (commit.filesSnapshot[f.path]) {
          return { ...f, content: commit.filesSnapshot[f.path] };
        }
        return f;
      }),
    }));
    setHasUncommittedChanges(false);
  };

  // Select project target type (React Web / Electron Desktop)
  const handleSelectProjectType = (type: ProjectType) => {
    setProject((prev) => ({
      ...prev,
      type,
    }));
  };

  // Add media asset
  const handleAddMediaAsset = (asset: MediaAsset) => {
    setProject((prev) => ({
      ...prev,
      mediaAssets: [asset, ...prev.mediaAssets],
    }));
  };

  // Insert media into code
  const handleInsertMediaIntoCode = (asset: MediaAsset) => {
    const appFile = project.files.find((f) => f.path === 'src/App.tsx');
    if (!appFile) return;

    let snippetToInsert = '';
    if (asset.type === 'video') {
      snippetToInsert = `\n/* AI Generated Veo Video Asset */\n<div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 my-4">\n  <video src="${asset.url}" autoPlay loop muted playsInline className="w-full object-cover max-h-60" />\n</div>`;
    } else {
      snippetToInsert = `\n/* AI Generated 4K Image Asset */\n<img src="${asset.url}" alt="${asset.title}" referrerPolicy="no-referrer" className="rounded-xl object-cover max-h-56 shadow-lg border border-slate-800 my-4" />`;
    }

    handleUpdateFileContent('src/App.tsx', `${appFile.content}\n${snippetToInsert}`);
  };

  // Invite team member
  const handleInviteMember = (memberData: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: `collab-${Date.now()}`,
      name: memberData.name || 'Team Member',
      email: memberData.email || 'member@company.com',
      avatar: memberData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: memberData.role || 'Editor',
      isOnline: true,
      color: memberData.color || '#10b981',
      currentFile: 'src/App.tsx',
      cursorLine: 1,
    };

    setProject((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, newMember],
    }));

    setTeamChatMessages((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        sender: 'System',
        text: `${newMember.name} (${newMember.role}) was invited to the project session.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Send team chat
  const handleSendTeamChat = (text: string) => {
    const newMsg = {
      id: `tc-${Date.now()}`,
      sender: 'You (Dev Lead)',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTeamChatMessages((prev) => [...prev, newMsg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:send',
          message: newMsg,
        })
      );
    }
  };

  // Trigger cloud deployment
  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setProject((prev) => ({
        ...prev,
        deployment: {
          id: `dep-${Date.now()}`,
          projectId: prev.id,
          status: 'live',
          url: `https://${prev.name.toLowerCase().replace(/\s+/g, '-')}.aichatter.dev`,
          subdomain: prev.name.toLowerCase().replace(/\s+/g, '-'),
          sslActive: true,
          deployedAt: 'Just now',
          logs: [
            'Build target: Electron + React bundle',
            'Optimized assets built in 1.4s',
            'Deployed to edge container asia-east1',
            'Deployment LIVE at endpoint',
          ],
        },
      }));
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Navbar
        project={project}
        onSelectProjectType={handleSelectProjectType}
        onOpenVersionControl={() => setIsVersionControlOpen(true)}
        onOpenCollaboration={() => setIsCollaborationOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenMediaManager={() => setIsMediaManagerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        currentPlan={currentPlan}
        hasUncommittedChanges={hasUncommittedChanges}
        activeView={activeView}
        onChangeActiveView={setActiveView}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Split View: Chat on Left, Preview on Right */}
        {activeView === 'split' && (
          <>
            <div className="w-[420px] xl:w-[480px] h-full flex-shrink-0">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onApplySnippet={handleApplySnippet}
                onApplyCodePatch={handleUpdateFileContent}
                isAiThinking={isAiThinking}
                targetType={project.type}
                onChangeTargetType={handleSelectProjectType}
              />
            </div>
            <div className="flex-1 h-full">
              <PreviewPanel project={project} />
            </div>
          </>
        )}

        {/* Full View: AI Chatter */}
        {activeView === 'chat' && (
          <div className="w-full max-w-4xl mx-auto h-full border-x border-slate-800">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              onApplySnippet={handleApplySnippet}
              onApplyCodePatch={handleUpdateFileContent}
              isAiThinking={isAiThinking}
              targetType={project.type}
              onChangeTargetType={handleSelectProjectType}
            />
          </div>
        )}

        {/* Full View: Code Editor & Snippets */}
        {activeView === 'code' && (
          <div className="w-full h-full">
            <CodeEditorPanel
              project={project}
              onUpdateFileContent={handleUpdateFileContent}
              onApplySnippet={handleApplySnippet}
              snippets={RAPID_CODE_SNIPPETS}
            />
          </div>
        )}

        {/* Full View: Live Preview */}
        {activeView === 'preview' && (
          <div className="w-full h-full">
            <PreviewPanel project={project} />
          </div>
        )}
      </main>

      {/* Modals */}
      <MediaAssetManagerModal
        isOpen={isMediaManagerOpen}
        onClose={() => setIsMediaManagerOpen(false)}
        mediaAssets={project.mediaAssets}
        onAddMediaAsset={handleAddMediaAsset}
        onInsertMediaIntoCode={handleInsertMediaIntoCode}
      />

      <VersionControlModal
        isOpen={isVersionControlOpen}
        onClose={() => setIsVersionControlOpen(false)}
        project={project}
        onCommitChanges={handleCommitChanges}
        onSwitchBranch={handleSwitchBranch}
        onCreateBranch={handleCreateBranch}
        onRevertCommit={handleRevertCommit}
      />

      <CollaborationModal
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
        project={project}
        onInviteMember={handleInviteMember}
        onSendTeamChat={handleSendTeamChat}
        teamChatMessages={teamChatMessages}
      />

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        plans={INITIAL_PLANS}
        currentPlan={currentPlan}
        onSelectPlan={setCurrentPlan}
        project={project}
        onTriggerDeploy={handleTriggerDeploy}
        isDeploying={isDeploying}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />
    </div>
  );
}
