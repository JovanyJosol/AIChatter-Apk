import { Project, CodeSnippet, SubscriptionPlan } from '../types';
import { 
  AI_CHATTER_APP_CODE, 
  AI_CHATTER_ELECTRON_MAIN, 
  AI_CHATTER_ELECTRON_PRELOAD 
} from './aichatterAppCode';

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    tagline: 'For individual prototyping and exploration',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Standard AI code assistance',
      'Browser sandbox real-time preview',
      'Export React web source code (ZIP)',
      '1 active local project branch',
      'Standard community support',
    ],
    limits: {
      aiPromptsPerMonth: '50 prompts/mo',
      cloudHostingSlots: 0,
      teamSeats: 'Single user',
      electronPackaging: 'Manual export only',
      aiMediaGeneration: '5 images/mo',
      dedicatedCustomDomain: false,
    },
  },
  {
    id: 'plus-go-pro',
    name: 'Plus Go Pro',
    tagline: 'High-speed AI generation, Cloud Hosting & Electron Packaging',
    priceMonthly: 29,
    priceYearly: 290,
    popular: true,
    features: [
      'Priority Gemini 3.8 Flash pipeline for ultra-fast app creation',
      'Cloud Project Hosting on custom *.aichatter.dev subdomains with SSL',
      'Instant Electron Desktop packaging (macOS .dmg, Windows .exe, Linux)',
      'Integrated Media Asset Manager: 4K AI Images & Veo AI Video generation',
      'Real-time collaborative editing for up to 10 team members',
      'Advanced Version Control with visual Git diffs and branch merging',
      'Native Desktop IPC generator (File system, Tray, Menubar, Notifications)',
      '24/7 Priority engineering assistance',
    ],
    limits: {
      aiPromptsPerMonth: 'Unlimited priority prompts',
      cloudHostingSlots: 5,
      teamSeats: '10 collaborative seats',
      electronPackaging: 'Instant 1-click package bundles',
      aiMediaGeneration: 'Unlimited AI Images & 50 Veo AI Videos/mo',
      dedicatedCustomDomain: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Studio',
    tagline: 'Custom infrastructure, air-gapped hosting & SLA',
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      'Everything in Plus Go Pro included',
      'Dedicated private Cloud Run container instances',
      'Custom SSO / SAML & Granular Role-Based Access Control',
      'Automated code signing for Apple Notarization & Windows Authenticode',
      'Custom AI fine-tuning for internal UI design systems',
      'Dedicated account manager & 99.99% uptime SLA guarantee',
    ],
    limits: {
      aiPromptsPerMonth: 'Dedicated throughput',
      cloudHostingSlots: 50,
      teamSeats: 'Unlimited seats',
      electronPackaging: 'Automated CI/CD code signed builds',
      aiMediaGeneration: 'Unlimited 4K & Veo studio generation',
      dedicatedCustomDomain: true,
    },
  },
];

export const RAPID_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-electron-ipc',
    title: 'Electron IPC Safe Bridge',
    description: 'contextBridge wrapper for secure file dialogue and native notifications',
    category: 'ipc',
    language: 'javascript',
    code: `// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  sendNotification: (title, body) => ipcRenderer.send('notify:show', { title, body }),
  onMenuTrigger: (callback) => ipcRenderer.on('menu:action', (_event, value) => callback(value))
});`,
  },
  {
    id: 'snip-electron-main',
    title: 'Electron Window & Tray Setup',
    description: 'Boilerplate main process with frameless window, system tray, and native menu',
    category: 'electron',
    language: 'javascript',
    code: `// main.electron.cjs
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(process.env.APP_URL || 'http://localhost:3000');
}

app.whenReady().then(createWindow);`,
  },
  {
    id: 'snip-react-ai-stream',
    title: 'Streaming AI Chat Hook',
    description: 'React hook for streaming token responses with Gemini 3.8 Flash',
    category: 'ai',
    language: 'typescript',
    code: `export function useAiChatStream() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamPrompt = async (prompt: string) => {
    setIsStreaming(true);
    const words = prompt.split(' ');
    for (const w of words) {
      await new Promise((r) => setTimeout(r, 40));
      setTokens((prev) => [...prev, w]);
    }
    setIsStreaming(false);
  };

  return { tokens, isStreaming, streamPrompt };
}`,
  },
  {
    id: 'snip-tailwind-glass',
    title: 'Modern Desktop Glass Card',
    description: 'Subtle backdrop-filter card with high contrast border for dark/light UIs',
    category: 'ui',
    language: 'css',
    code: `/* Glassmorphic card utility */
.desktop-glass {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.dark .desktop-glass {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(51, 65, 85, 0.6);
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.4);
}`,
  },
];

export const DEFAULT_MEDIA_ASSETS = [
  {
    id: 'asset-img-1',
    title: 'Neon Cyber Synth Icon',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    prompt: 'Sleek minimal 3D audio synthesizer icon, warm amber and violet ambient glow, hyperrealistic render, 4k',
    aspectRatio: '1:1' as const,
    createdAt: 'Just now',
    fileSize: '1.2 MB',
    styleTag: '3D Studio',
  },
  {
    id: 'asset-img-2',
    title: 'Cloud Pulse Analytics Hero',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80',
    prompt: 'Futuristic telemetry dashboard visualization with volumetric charts and subtle neon gradients, 16:9 banner',
    aspectRatio: '16:9' as const,
    createdAt: '10 min ago',
    fileSize: '2.4 MB',
    styleTag: 'Hero Banner',
  },
  {
    id: 'asset-vid-1',
    title: 'Dynamic Waveform Loop',
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    prompt: 'Abstract liquid audio waves undulating smoothly in dark space, cinematic golden particles, 60fps loop',
    aspectRatio: '16:9' as const,
    createdAt: '25 min ago',
    durationSec: 15,
    fileSize: '8.4 MB',
    styleTag: 'Veo Video',
  },
  {
    id: 'asset-vid-2',
    title: 'Cloud Servers Flow',
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    prompt: 'Slow orbit camera around interconnected glowing optical nodes and telemetry streams, tech concept, 4k',
    aspectRatio: '16:9' as const,
    createdAt: '1 hour ago',
    durationSec: 12,
    fileSize: '6.1 MB',
    styleTag: 'Veo Video',
  },
];

export const INITIAL_COLLABORATORS = [
  {
    id: 'collab-1',
    name: 'You (Dev Lead)',
    email: 'jovannyjore39@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    role: 'Owner' as const,
    isOnline: true,
    color: '#3b82f6',
    currentFile: 'src/App.tsx',
    cursorLine: 42,
  },
  {
    id: 'collab-2',
    name: 'Elena Rostova',
    email: 'elena.r@studio.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    role: 'Editor' as const,
    isOnline: true,
    color: '#10b981',
    currentFile: 'main.electron.cjs',
    cursorLine: 28,
  },
  {
    id: 'collab-3',
    name: 'Marcus Chen',
    email: 'marcus.c@studio.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    role: 'Reviewer' as const,
    isOnline: false,
    color: '#f59e0b',
    currentFile: 'preload.js',
    cursorLine: 12,
  },
];



const ELECTRON_PACKAGE_JSON = `{
  "name": "aichatter",
  "version": "1.0.0",
  "description": "AI Chatter Desktop Studio application",
  "main": "main.electron.cjs",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "electron .",
    "start:electron": "concurrently \"vite\" \"wait-on http://localhost:3000 && electron .\"",
    "package:mac": "electron-builder --mac",
    "package:win": "electron-builder --win",
    "package:linux": "electron-builder --linux"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0"
  },
  "devDependencies": {
    "electron": "^34.0.0",
    "electron-builder": "^25.1.8",
    "concurrently": "^9.1.0",
    "wait-on": "^8.0.1",
    "vite": "^8.3.0",
    "@tailwindcss/vite": "^4.3.0"
  },
  "build": {
    "appId": "com.aichatter.desktop",
    "productName": "AIChatter",
    "directories": {
      "output": "release"
    },
    "mac": {
      "category": "public.app-category.music",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}`;

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-aichatter',
    name: 'AIChatter',
    description: 'AI Chatter Desktop Studio application with native Windows integration, Web Audio DSP, and AI chat pipeline',
    type: 'electron-desktop',
    currentBranch: 'main',
    branches: [
      { name: 'main', isDefault: true, lastCommitHash: '8b4d10f' },
      { name: 'feature/windows-native', isDefault: false, lastCommitHash: '2c9e71a' },
      { name: 'v2-desktop-ui', isDefault: false, lastCommitHash: '5e110c4' },
    ],
    windowConfig: {
      title: 'AIChatter Desktop Studio',
      width: 1240,
      height: 820,
      minWidth: 900,
      minHeight: 600,
      frame: false,
      titleBarStyle: 'hiddenInset',
      transparent: false,
      resizable: true,
      alwaysOnTop: false,
      macTrafficLights: true,
      menuBarVisible: true,
      appIconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    },
    activeFilePath: 'src/App.tsx',
    files: [
      {
        id: 'file-app',
        name: 'App.tsx',
        path: 'src/App.tsx',
        language: 'typescript',
        content: AI_CHATTER_APP_CODE,
      },
      {
        id: 'file-main-electron',
        name: 'main.electron.cjs',
        path: 'main.electron.cjs',
        language: 'javascript',
        content: AI_CHATTER_ELECTRON_MAIN,
      },
      {
        id: 'file-preload',
        name: 'preload.js',
        path: 'preload.js',
        language: 'javascript',
        content: AI_CHATTER_ELECTRON_PRELOAD,
      },
      {
        id: 'file-pkg',
        name: 'package.json',
        path: 'package.json',
        language: 'json',
        content: ELECTRON_PACKAGE_JSON,
      },
      {
        id: 'file-readme',
        name: 'README.md',
        path: 'README.md',
        language: 'markdown',
        content: `# AIChatter - Desktop & Web Application

Built with **AI Chatter Studio**.

### Quick Start (Web)
\`\`\`bash
npm install
npm run dev
\`\`\`

### Quick Start (Electron Desktop)
\`\`\`bash
npm install
npm run start:electron
\`\`\`

### Packaging Desktop Binary
- macOS DMG: \`npm run package:mac\`
- Windows EXE: \`npm run package:win\`
- Linux AppImage: \`npm run package:linux\`
`,
      },
    ],
    commits: [
      {
        id: 'cmt-1',
        hash: '8b4d10f',
        message: 'feat: add Gemini 3.8 Flash model pipeline and Windows launcher',
        author: {
          name: 'You (Dev Lead)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        },
        timestamp: '12 minutes ago',
        branch: 'main',
        changesCount: 4,
        filesSnapshot: {
          'src/App.tsx': AI_CHATTER_APP_CODE,
        },
      },
      {
        id: 'cmt-2',
        hash: '3f90a21',
        message: 'initial: scaffold AIChatter desktop workspace, IPC bridge and telemetry',
        author: {
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        },
        timestamp: '1 hour ago',
        branch: 'main',
        changesCount: 6,
        filesSnapshot: {
          'src/App.tsx': AI_CHATTER_APP_CODE,
        },
      },
    ],
    collaborators: INITIAL_COLLABORATORS,
    mediaAssets: DEFAULT_MEDIA_ASSETS,
    deployment: {
      id: 'dep-1',
      projectId: 'proj-aichatter',
      status: 'live',
      url: 'https://aichatter.aichatter.dev',
      subdomain: 'aichatter',
      sslActive: true,
      deployedAt: 'Today at 07:15 AM',
      logs: [
        'Build target: Electron + Web React bundle',
        'Vite production assets optimized (142 kB gzip)',
        'Container provisioned at edge asia-east1',
        'SSL certificate auto-renewed (*.aichatter.dev)',
        'Deployment LIVE at https://aichatter.aichatter.dev',
      ],
    },
    createdAt: '2026-09-17T06:30:00Z',
    updatedAt: '2026-09-17T07:45:00Z',
  },
];
