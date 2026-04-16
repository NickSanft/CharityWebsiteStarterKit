'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BasicsStep } from './_components/BasicsStep';
import { PagesStep } from './_components/PagesStep';
import { IntegrationsStep } from './_components/IntegrationsStep';
import { DownloadStep } from './_components/DownloadStep';
import { Preview } from './_components/Preview';
import { DEFAULTS, type BuilderState } from '@/lib/builder/schema';
import type { TemplateManifest } from '@/lib/builder/render';

const STEPS = ['Basics', 'Pages', 'Integrations', 'Download'] as const;
type Step = (typeof STEPS)[number];

const STORAGE_KEY = 'charity-builder-state';

function loadSaved(): BuilderState {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export default function BuilderPage() {
  const [step, setStep] = useState<Step>('Basics');
  const [state, setState] = useState<BuilderState>(DEFAULTS);
  const [manifest, setManifest] = useState<TemplateManifest | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  // Restore from localStorage on mount (client only).
  useEffect(() => {
    setState(loadSaved());
  }, []);

  // Fetch the template manifest.
  useEffect(() => {
    let cancelled = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    fetch(`${base}/builder-template.json`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TemplateManifest>;
      })
      .then((m) => {
        if (!cancelled) setManifest(m);
      })
      .catch((err) => {
        if (!cancelled) setManifestError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<BuilderState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* quota exceeded, ignore */ }
      return next;
    });
  }, []);

  async function onDownload() {
    if (!manifest) return;
    setDownloading(true);
    try {
      const { buildAndDownloadZip } = await import('@/lib/builder/zip');
      await buildAndDownloadZip(manifest, state);
    } catch (err) {
      console.error(err);
      alert(`Could not build zip: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDownloading(false);
    }
  }

  const idx = STEPS.indexOf(step);

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Charity Website Builder</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Configure your site, preview it live, and download a zip for GitHub Pages.
              </p>
            </div>
            {/* Mobile form/preview toggle */}
            <div className="flex gap-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileView('form')}
                className={`rounded px-3 py-1.5 text-sm ${
                  mobileView === 'form' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setMobileView('preview')}
                className={`rounded px-3 py-1.5 text-sm ${
                  mobileView === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => { setStep(s); setMobileView('form'); }}
                className={`rounded px-2 py-1 sm:px-3 sm:py-1.5 ${
                  s === step ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="mr-1 inline-block h-5 w-5 rounded-full bg-background/30 text-center text-xs leading-5 sm:mr-2">
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
                <span className="sm:hidden">{s.slice(0, 3)}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,2fr)_3fr]">
        <section className={`min-h-0 overflow-y-auto border-r p-4 lg:block lg:p-6 ${mobileView === 'preview' ? 'hidden' : ''}`}>
          {manifestError && (
            <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              Failed to load template manifest: {manifestError}. Run{' '}
              <code className="rounded bg-background px-1">npm run builder:manifest</code> and reload.
            </div>
          )}

          {step === 'Basics' && <BasicsStep state={state} update={update} />}
          {step === 'Pages' && <PagesStep state={state} update={update} />}
          {step === 'Integrations' && <IntegrationsStep state={state} update={update} />}
          {step === 'Download' && (
            <DownloadStep state={state} onDownload={onDownload} downloading={downloading} />
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              disabled={idx === 0}
              onClick={() => setStep(STEPS[Math.max(0, idx - 1)])}
            >
              Back
            </Button>
            <Button
              disabled={idx === STEPS.length - 1}
              onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, idx + 1)])}
            >
              Next
            </Button>
          </div>
        </section>

        <section className={`min-h-0 bg-muted/30 lg:block ${mobileView === 'form' ? 'hidden' : ''}`}>
          <Preview state={state} manifest={manifest} />
        </section>
      </div>
    </div>
  );
}
