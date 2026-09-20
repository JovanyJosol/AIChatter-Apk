export type ProjectType = 'web-react' | 'electron-desktop';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'markdown';
  content: string;
  isReadOnly?: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  category: 'electron' | 'react' | 'ui' | 'ipc' | 'audio' | 'state' | 'ai';
  code: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  snippets?: CodeSnippet[];
  suggestedActions?: string[];
  filePatches?: {
    path: string;
    description: string;
    content: string;
  }[];
  generatedAssets?: MediaAsset[];
  isStreaming?: boolean;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'icon';
  url: string;
  thumbnailUrl?: string;
  prompt?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  createdAt: string;
  durationSec?: number;
  fileSize?: string;
  styleTag?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Owner' | 'Editor' | 'Reviewer' | 'Viewer';
  isOnline: boolean;
  color: string;
  currentFile?: string;
  cursorLine?: number;
}

export interface VersionCommit {
  id: string;
  hash: string;
  message: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  branch: string;
  filesSnapshot: Record<string, string>;
  changesCount: number;
}

export interface Branch {
  name: string;
  isDefault: boolean;
  lastCommitHash: string;
}

export interface DesktopWindowConfig {
  title: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  frame: boolean;
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
  transparent: boolean;
  resizable: boolean;
  alwaysOnTop: boolean;
  macTrafficLights: boolean;
  menuBarVisible: boolean;
  appIconUrl: string;
}

export type SubscriptionPlanId = 'free' | 'plus-go-pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  popular?: boolean;
  features: string[];
  limits: {
    aiPromptsPerMonth: string;
    cloudHostingSlots: number;
    teamSeats: string;
    electronPackaging: string;
    aiMediaGeneration: string;
    dedicatedCustomDomain: boolean;
  };
}

export interface CloudDeployment {
  id: string;
  projectId: string;
  status: 'idle' | 'building' | 'deploying' | 'live' | 'failed';
  url: string;
  subdomain: string;
  customDomain?: string;
  sslActive: boolean;
  deployedAt?: string;
  logs: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  files: ProjectFile[];
  activeFilePath: string;
  windowConfig: DesktopWindowConfig;
  branches: Branch[];
  currentBranch: string;
  commits: VersionCommit[];
  collaborators: TeamMember[];
  mediaAssets: MediaAsset[];
  deployment?: CloudDeployment;
  createdAt: string;
  updatedAt: string;
}
