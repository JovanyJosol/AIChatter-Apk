import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Globe, Shield, Zap, Server, 
  ExternalLink, RefreshCw, Terminal, ArrowRight, Laptop
} from 'lucide-react';
import { SubscriptionPlan, SubscriptionPlanId, Project } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlanId;
  onSelectPlan: (planId: SubscriptionPlanId) => void;
  project: Project;
  onTriggerDeploy: () => void;
  isDeploying: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  plans,
  currentPlan,
  onSelectPlan,
  project,
  onTriggerDeploy,
  isDeploying,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'plans' | 'hosting'>('plans');
  const [subdomainInput, setSubdomainInput] = useState('aichatter');
  const [customDomain, setCustomDomain] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[88vh] shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Plus Go Pro Subscription</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CURRENT: {currentPlan === 'plus-go-pro' ? 'PLUS GO PRO' : currentPlan.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">Unlock high-speed Gemini 3.8, Cloud Project Hosting & Desktop Packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'plans' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Subscription Plans
              </button>
              <button
                onClick={() => setActiveTab('hosting')}
                className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                  activeTab === 'hosting' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Cloud Project Hosting
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

        {/* Tab 1: Plans Grid */}
        {activeTab === 'plans' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Billing toggle */}
            <div className="flex justify-center items-center gap-3 text-xs">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-all relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-amber-400 transition-all ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                  Yearly Billing
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-semibold">
                  Save 17%
                </span>
              </div>
            </div>

            {/* Plans Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => {
                const isCurrent = currentPlan === plan.id;
                const isPopular = plan.popular;
                const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12);

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                      isPopular
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/80 shadow-xl shadow-amber-500/10'
                        : 'bg-slate-950/60 border border-slate-800'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                        Recommended for Devs
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-4 min-h-[32px] leading-snug">{plan.tagline}</p>

                      <div className="mb-4">
                        <span className="text-3xl font-extrabold text-white">${price}</span>
                        <span className="text-xs text-slate-400 font-mono"> / month</span>
                        {billingCycle === 'yearly' && plan.priceYearly > 0 && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Billed ${plan.priceYearly} annually
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-[11px] leading-tight">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => onSelectPlan(plan.id)}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : isPopular
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/25'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Cloud Project Hosting */}
        {activeTab === 'hosting' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Globe className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-amber-300 text-sm mb-1">
                  Plus Go Pro Cloud Hosting Infrastructure
                </div>
                <p className="text-amber-200/80 leading-relaxed">
                  Your applications and Electron build targets are automatically deployed to isolated Cloud Run edge containers with global CDN distribution, HTTP/3, and automatic TLS/SSL certificate issuance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Domain & URL Manager */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-sm text-white">Project Domain Configuration</h3>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    ASSIGNED CLOUD SUBDOMAIN:
                  </label>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden px-3 py-2">
                    <input
                      type="text"
                      value={subdomainInput}
                      onChange={(e) => setSubdomainInput(e.target.value)}
                      className="bg-transparent text-white font-mono text-xs focus:outline-none flex-1"
                    />
                    <span className="text-slate-500 font-mono text-xs">.aichatter.dev</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    CUSTOM DOMAIN (PRO PLAN ONLY):
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. app.mycompany.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">CNAME record points to edge.aichatter.dev</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onTriggerDeploy}
                    disabled={isDeploying}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Building & Deploying to Edge Container...
                      </>
                    ) : (
                      <>
                        <Server className="w-3.5 h-3.5" />
                        Deploy Changes to Cloud
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Deployment Live Status & Logs */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Edge Deployment Status</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Target URL:</span>
                    <a
                      href={`https://${subdomainInput}.aichatter.dev`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      https://{subdomainInput}.aichatter.dev
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>SSL Certificate:</span>
                    <span className="text-emerald-400 font-mono">Active (TLS 1.3 256-bit)</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Active Regions:</span>
                    <span className="text-slate-200 font-mono">Multi-region edge (Asia, US, EU)</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Deployment Build Logs</div>
                  <div className="flex-1 p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] text-emerald-300/90 space-y-1 overflow-y-auto max-h-36">
                    <div>[07:15:02] Build step 1: Compiling React 19 client components</div>
                    <div>[07:15:04] Vite tree-shaking complete (142 kB gzip)</div>
                    <div>[07:15:06] Electron desktop main process verified</div>
                    <div>[07:15:08] Edge container provisioned on Cloud Run</div>
                    <div>[07:15:10] TLS/SSL certificate verified for *.aichatter.dev</div>
                    <div className="text-white font-bold">[07:15:11] READY: Application live at endpoint</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
