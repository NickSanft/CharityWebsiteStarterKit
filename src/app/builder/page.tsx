'use client';

import { useEffect, useState } from 'react';
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

export default function BuilderPage() {
  const [step, setStep] = useState<Step>('Basics');
  const [state, setState] = useState<BuilderState>(DEFAULTS);
  const [manifest, setManifest] = useState<TemplateManifest | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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

  function update(patch: Partial<BuilderState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

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
      <header className="border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Charity Website Builder</h1>
            <p className="text-xs text-muted-foreground">
              Configure your site, preview it live, and download a zip for GitHub Pages.
            </p>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`rounded px-3 py-1.5 ${
                  s === step ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <span className="mr-2 inline-block h-5 w-5 rounded-full bg-background/30 text-center text-xs leading-5">
                  {i + 1}
                </span>
                {s}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,2fr)_3fr]">
        <section className="min-h-0 overflow-y-auto border-r p-6">
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

        <section className="min-h-0 bg-muted/30">
          <Preview state={state} manifest={manifest} />
        </section>
      </div>
    </div>
  );
}
