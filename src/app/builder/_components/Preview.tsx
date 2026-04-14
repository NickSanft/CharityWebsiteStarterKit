'use client';

import { useMemo, useState } from 'react';
import { buildRenderContext, pageFileFor, renderPreview, type TemplateManifest } from '@/lib/builder/render';
import { PAGE_KEYS, PAGE_LABEL, type BuilderState, type PageKey } from '@/lib/builder/schema';
import { Button } from '@/components/ui/button';

type PreviewKey = 'home' | PageKey;

export function Preview({
  state,
  manifest,
}: {
  state: BuilderState;
  manifest: TemplateManifest | null;
}) {
  const [active, setActive] = useState<PreviewKey>('home');

  const ctx = useMemo(() => buildRenderContext(state), [state]);

  const html = useMemo(() => {
    if (!manifest) return '';
    return renderPreview(manifest, pageFileFor(active), ctx);
  }, [manifest, active, ctx]);

  const enabledTabs: PreviewKey[] = [
    'home',
    ...PAGE_KEYS.filter((k) => state.enabled_pages[k]),
  ];

  // If current tab got disabled, fall back to home.
  if (active !== 'home' && !state.enabled_pages[active]) {
    setActive('home');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-2">
        {enabledTabs.map((key) => (
          <Button
            key={key}
            size="sm"
            variant={active === key ? 'default' : 'ghost'}
            onClick={() => setActive(key)}
          >
            {key === 'home' ? 'Home' : PAGE_LABEL[key]}
          </Button>
        ))}
      </div>
      <div className="relative flex-1 bg-white">
        {manifest ? (
          <iframe
            title="Site preview"
            srcDoc={html}
            className="h-full w-full border-0"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading template…
          </div>
        )}
      </div>
    </div>
  );
}
