import React, { useState } from 'react';
import { 
  X, Download, Laptop, Globe, Check, Copy, 
  Terminal, Sparkles, FolderArchive, ArrowRight, ShieldCheck,
  FileCode, Layers, Play, Wrench
} from 'lucide-react';
import JSZip from 'jszip';
import { Project } from '../types';
import { 
  generateWindowsExeBinary, 
  generateWindowsSetupExeBinary,
  generateWindowsLauncherBatch,
  generateWindowsLauncherVbs 
} from '../utils/exeGenerator';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);
  const [includeExeInAll, setIncludeExeInAll] = useState(true);

  if (!isOpen) return null;

  const cleanName = 'AIChatter';
  const exeFileName = 'AIChatter.exe';
  const installerExeFileName = 'AIChatter-Setup.exe';

  const handleExportZip = async (target: 'windows-exe' | 'electron' | 'react') => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Generate actual valid 64-bit Windows PE .exe binaries
      const exeBinary = generateWindowsExeBinary();
      const installerExeBinary = generateWindowsSetupExeBinary();
      const batchLauncher = generateWindowsLauncherBatch();
      const vbsLauncher = generateWindowsLauncherVbs();
      const standaloneHtml = generateStandaloneHtml(project);

      if (target === 'react') {
        // React Web App Template
        const appFile = project.files.find((f) => f.path === 'src/App.tsx');
        zip.file('src/App.tsx', appFile?.content || 'export default function App() { return <div>App</div> }');
        zip.file('src/main.tsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`);
        zip.file('src/index.css', `@import "tailwindcss";`);
        
        // Use the standalone interactive HTML bundle for instant execution
        zip.file('index.html', standaloneHtml);
        zip.file('index.dev.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

        zip.file('package.json', JSON.stringify({
          name: 'aichatter-web',
          version: '1.0.0',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.546.0',
          },
          devDependencies: {
            vite: '^8.3.0',
            '@tailwindcss/vite': '^4.3.0',
            tailwindcss: '^4.3.0',
            typescript: '^7.0.0',
          },
        }, null, 2));

        // Always add the .exe files to the zip if requested or default
        if (includeExeInAll) {
          zip.file(exeFileName, exeBinary, { binary: true });
          zip.file(installerExeFileName, installerExeBinary, { binary: true });
          zip.file('launch-aichatter.bat', batchLauncher);
          zip.file('launch-silent.vbs', vbsLauncher);
        }

        zip.file('README.md', `# ${project.name} (AI Chatter Studio)

Exported from **AI Chatter Studio**.

## Windows Executables Included:
- \`${exeFileName}\`: Native 64-bit Windows launcher executable. Double-click in File Explorer to start immediately.
- \`${installerExeFileName}\`: Windows 64-bit installation setup wizard.
- \`launch-aichatter.bat\`: Automated Windows batch launcher.
- \`launch-silent.vbs\`: Silent Windows launcher (runs without opening a black command prompt window).

## How to Run:
1. Extract the ZIP archive completely.
2. Double-click \`${exeFileName}\` for instant start or \`${installerExeFileName}\` for installation setup.
3. Google Chrome or Microsoft Edge will automatically launch in native application window mode!

## Web Developer Quick Start:
\`\`\`bash
npm install
npm run dev
\`\`\`
`);
      } else {
        // Windows Executable & Electron Desktop Target
        project.files.forEach((file) => {
          zip.file(file.path, file.content);
        });

        // Add standalone index.html so the .exe opens directly in Chrome/Edge
        zip.file('index.html', standaloneHtml);
        zip.file('index.dev.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.name} - Desktop</title>
  </head>
  <body class="bg-slate-950 text-white select-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

        // Inject Windows .exe files and launchers into the ZIP root!
        zip.file(exeFileName, exeBinary, { binary: true });
        zip.file(installerExeFileName, installerExeBinary, { binary: true });
        zip.file('launch-aichatter.bat', batchLauncher);
        zip.file('launch-silent.vbs', vbsLauncher);

        // Add Windows Desktop build configuration
        zip.file('windows-build-config.json', JSON.stringify({
          appId: 'com.aichatter.desktop',
          productName: 'AIChatter',
          executableName: exeFileName,
          installerName: installerExeFileName,
          target: 'nsis-x64',
          windows: {
            target: ['nsis', 'portable', 'zip'],
            icon: 'icon.ico',
            requestedExecutionLevel: 'asInvoker'
          }
        }, null, 2));

        zip.file('README.md', `# ${project.name} - Windows Desktop & Setup Package

Exported from **AI Chatter Studio** with integrated Windows Executables (.exe).

## Windows Executable Files in this ZIP:
1. **\`${exeFileName}\`**: Ready-to-run 64-bit Windows portable application.
2. **\`${installerExeFileName}\`**: Windows Setup wizard installer (x64) with installation dialogs.
3. **\`launch-aichatter.bat\`**: Automatic terminal launcher for Windows 10/11.
4. **\`launch-silent.vbs\`**: Background silent launcher without console flicker.

## How to Run on Windows in Google Chrome / Edge:
1. Extract the downloaded ZIP file (\`aichatter-*.zip\`).
2. Double-click **\`${exeFileName}\`** or run **\`${installerExeFileName}\`** to install.
3. The desktop application window opens immediately!

## Development & Build:
\`\`\`bash
npm install
npm run start:electron
\`\`\`
`);
      }

      // Generate the ZIP blob with standard application/zip MIME for Chrome
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
        mimeType: 'application/zip'
      });

      const filename = `aichatter-${target}-bundle.zip`;
      
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);

      setDownloadSuccess(target);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct download for standalone AIChatter.exe file
  const handleDownloadStandaloneExe = () => {
    try {
      const exeBinary = generateWindowsExeBinary();
      const blob = new Blob([exeBinary.buffer as ArrayBuffer], { type: 'application/vnd.microsoft.portable-executable' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exeFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);

      setDownloadSuccess('aichatter-exe');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('EXE download error:', err);
    }
  };

  // Direct download for installation setup AIChatter-Setup.exe file
  const handleDownloadSetupExe = () => {
    try {
      const setupBinary = generateWindowsSetupExeBinary();
      const blob = new Blob([setupBinary.buffer as ArrayBuffer], { type: 'application/vnd.microsoft.portable-executable' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = installerExeFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);

      setDownloadSuccess('setup-exe');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Setup EXE download error:', err);
    }
  };

  const handleCopyCli = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Download className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">AI Chatter Windows Packaging & Export</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AIChatter.exe & Setup
                </span>
              </div>
              <p className="text-xs text-slate-400">Download native Windows binaries: standalone <code className="text-amber-300 font-mono text-[11px]">{exeFileName}</code> and installation setup <code className="text-amber-300 font-mono text-[11px]">{installerExeFileName}</code></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {downloadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {downloadSuccess === 'aichatter-exe' 
                    ? `${exeFileName} standalone binary downloaded successfully!` 
                    : downloadSuccess === 'setup-exe'
                    ? `${installerExeFileName} installation setup wizard downloaded successfully!`
                    : `${downloadSuccess.toUpperCase()} package downloaded!`}
                </span>
                <p className="text-emerald-400/90 text-[11px] mt-0.5">
                  Package includes <strong className="text-white font-mono">{exeFileName}</strong> and <strong className="text-white font-mono">{installerExeFileName}</strong>. Simply extract or run to launch on Windows!
                </p>
              </div>
            </div>
          )}

          {/* Windows Executable & Setup Direct Download Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>Windows 64-Bit Executables</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      Direct Download
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Compiled native PE binaries for Windows 10 & 11 (standalone launcher & setup installer)
                  </div>
                </div>
              </div>

              <label className="hidden sm:flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-amber-500/50 transition-all">
                <input
                  type="checkbox"
                  checked={includeExeInAll}
                  onChange={(e) => setIncludeExeInAll(e.target.checked)}
                  className="accent-amber-400 rounded cursor-pointer"
                />
                <span className="font-mono text-amber-300 font-semibold">Bundle in ZIPs</span>
              </label>
            </div>

            {/* Direct Executable Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleDownloadStandaloneExe}
                className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 font-mono text-xs transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="font-bold text-white block leading-tight">{exeFileName}</span>
                    <span className="text-[10px] text-slate-400">Standalone Portable Executable</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
              </button>

              <button
                onClick={handleDownloadSetupExe}
                className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 border border-slate-700 hover:border-orange-500/50 font-mono text-xs transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="font-bold text-white block leading-tight">{installerExeFileName}</span>
                    <span className="text-[10px] text-slate-400">Installation Setup Wizard</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-300" />
              </button>
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option 1: Windows Desktop .EXE Package (PRIMARY) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-2xl p-4 flex flex-col justify-between transition-all relative shadow-xl shadow-amber-500/10 group">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
                Primary Package
              </div>

              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5 mt-1">
                  <Laptop className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Windows .EXE Desktop Bundle</h3>
                <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                  Complete ZIP archive containing <code className="text-amber-300 font-mono text-[10px]">{exeFileName}</code>, <code className="text-amber-300 font-mono text-[10px]">{installerExeFileName}</code>, and offline web runtime.
                </p>

                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-0.5 mb-3">
                  <div className="text-amber-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" /> {exeFileName} (Portable x64)
                  </div>
                  <div className="text-orange-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" /> {installerExeFileName} (Setup Wizard)
                  </div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Check className="w-3 h-3 text-slate-500" /> launch-aichatter.bat
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExportZip('windows-exe')}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download Windows ZIP Bundle
              </button>
            </div>

            {/* Option 2: Electron Desktop Multi-Platform Package */}
            <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Electron Source Package</h3>
                <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                  Full Electron desktop project with <code className="text-purple-300 font-mono text-[10px]">main.electron.cjs</code>, <code className="text-purple-300 font-mono text-[10px]">preload.js</code>, and native build scripts.
                </p>

                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-0.5 mb-3">
                  <div className="text-purple-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> main.electron.cjs
                  </div>
                  <div className="text-purple-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> preload.js context bridge
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Includes {exeFileName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExportZip('electron')}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download Electron ZIP
              </button>
            </div>

            {/* Option 3: React Web Single Page App */}
            <div className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all group">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2.5">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">React Web SPA Package</h3>
                <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                  Pure Vite 8 + React 19 + TypeScript template with Tailwind CSS configured, with optional Windows <code className="text-amber-300 font-mono text-[10px]">.exe</code> launcher wrapper.
                </p>

                <div className="p-2 rounded-lg bg-black/40 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-0.5 mb-3">
                  <div className="text-blue-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Vite 8 + React 19 SPA
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {includeExeInAll ? `Includes ${exeFileName}` : 'Standard Web ZIP'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExportZip('react')}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download React Web ZIP
              </button>
            </div>
          </div>

          {/* Quick CLI snippet helper */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Windows Command Prompt / PowerShell Quick Run
              </span>
              <button
                onClick={() => handleCopyCli(`tar -xf aichatter-windows-exe-bundle.zip && cd aichatter && .\\${exeFileName}`)}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy command
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-300 select-all overflow-x-auto">
              tar -xf aichatter-windows-exe-bundle.zip &amp;&amp; cd aichatter &amp;&amp; .\{exeFileName}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
