import React, { useState } from 'react';
import { 
  X, Image as ImageIcon, Video, Sparkles, Plus, Download, 
  Copy, Check, Code, Play, Pause, RefreshCw, Wand2, Filter
} from 'lucide-react';
import { MediaAsset } from '../types';

interface MediaAssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaAssets: MediaAsset[];
  onAddMediaAsset: (asset: MediaAsset) => void;
  onInsertMediaIntoCode: (asset: MediaAsset) => void;
}

export const MediaAssetManagerModal: React.FC<MediaAssetManagerModalProps> = ({
  isOpen,
  onClose,
  mediaAssets,
  onAddMediaAsset,
  onInsertMediaIntoCode,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [activeTab, setActiveTab] = useState<'gallery' | 'generate'>('gallery');
  const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('3D Studio');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredAssets = mediaAssets.filter((asset) => {
    if (filterType === 'all') return true;
    return asset.type === filterType;
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: generationType,
          style,
          aspectRatio,
        }),
      });

      if (res.ok) {
        const newAsset: MediaAsset = await res.json();
        onAddMediaAsset(newAsset);
        setActiveTab('gallery');
        setPrompt('');
      }
    } catch (err) {
      console.error('Asset generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (asset: MediaAsset) => {
    onInsertMediaIntoCode(asset);
    setInsertedId(asset.id);
    setTimeout(() => setInsertedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Integrated Media Asset Manager</h2>
              <p className="text-xs text-slate-400">Generate 4K AI Images & Veo AI Videos directly for desktop & web apps</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'gallery' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Media Library ({mediaAssets.length})
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === 'generate' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-300 hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                Generate with AI
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery View */}
        {activeTab === 'gallery' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Bar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] uppercase">Filter:</span>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-0.5 rounded-full ${
                    filterType === 'all' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  All ({mediaAssets.length})
                </button>
                <button
                  onClick={() => setFilterType('image')}
                  className={`px-2.5 py-0.5 rounded-full ${
                    filterType === 'image' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  AI Images ({mediaAssets.filter((a) => a.type === 'image').length})
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`px-2.5 py-0.5 rounded-full ${
                    filterType === 'video' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'hover:text-slate-200'
                  }`}
                >
                  AI Veo Videos ({mediaAssets.filter((a) => a.type === 'video').length})
                </button>
              </div>

              <button
                onClick={() => setActiveTab('generate')}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                New AI Generation
              </button>
            </div>

            {/* Asset Grid */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 rounded-xl overflow-hidden flex flex-col transition-all shadow-md hover:shadow-purple-500/10"
                >
                  {/* Media Visual Container */}
                  <div className="relative aspect-video bg-black/60 flex items-center justify-center overflow-hidden">
                    {asset.type === 'video' ? (
                      <video
                        src={asset.url}
                        poster={asset.thumbnailUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-semibold text-white flex items-center gap-1">
                        {asset.type === 'video' ? <Video className="w-2.5 h-2.5 text-rose-400" /> : <ImageIcon className="w-2.5 h-2.5 text-purple-400" />}
                        {asset.type === 'video' ? 'Veo Video' : 'AI Image'}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                        {asset.aspectRatio}
                      </span>
                    </div>
                  </div>

                  {/* Asset Details & Actions */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate">{asset.title}</h4>
                      {asset.prompt && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {asset.prompt}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[10px] text-slate-500">{asset.fileSize || '1.8 MB'}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyUrl(asset.id, asset.url)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                          title="Copy Asset CDN URL"
                        >
                          {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleInsert(asset)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                            insertedId === asset.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-500/20'
                          }`}
                        >
                          {insertedId === asset.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              Inserted!
                            </>
                          ) : (
                            <>
                              <Code className="w-3 h-3" />
                              Insert to Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate View */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerate} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGenerationType('image')}
                className={`flex-1 p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  generationType === 'image'
                    ? 'bg-purple-500/10 border-purple-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Generate AI Image</div>
                  <div className="text-[11px] text-slate-400">4K resolution for icons, wallpapers & banners</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGenerationType('video')}
                className={`flex-1 p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  generationType === 'video'
                    ? 'bg-rose-500/10 border-rose-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Generate Veo AI Video</div>
                  <div className="text-[11px] text-slate-400">Smooth 60fps dynamic motion loops & textures</div>
                </div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Generation Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  generationType === 'image'
                    ? 'e.g. "Hyperrealistic 3D desktop audio visualizer with warm violet lighting and brushed titanium dials, 4k"'
                    : 'e.g. "Cinematic 60fps flowing neon audio sound waves undulating in space, slow camera drift, seamless loop"'
                }
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Artistic Style Preset
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="3D Studio">3D Studio Render</option>
                  <option value="Cyberpunk">Cyberpunk Ambient Neon</option>
                  <option value="Glassmorphism">Glassmorphism UI</option>
                  <option value="Minimalist Vector">Minimalist Vector</option>
                  <option value="Photorealistic">Photorealistic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {(['1:1', '16:9', '4:3', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 rounded-lg border text-center transition-all ${
                        aspectRatio === ratio
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating Asset...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesize {generationType === 'video' ? 'Veo Video' : '4K Image'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
