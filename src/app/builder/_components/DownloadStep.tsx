'use client';

import { Button } from '@/components/ui/button';
import { PAGE_KEYS, PAGE_LABEL, type BuilderState } from '@/lib/builder/schema';

export function DownloadStep({
  state,
  onDownload,
  downloading,
}: {
  state: BuilderState;
  onDownload: () => void;
  downloading: boolean;
}) {
  const enabled = PAGE_KEYS.filter((k) => state.enabled_pages[k]);

  return (
    <div className="space-y-5">
      <section className="rounded-md border bg-muted/40 p-4">
        <h3 className="font-medium">Review</h3>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Charity</dt>
          <dd>{state.charity_name || <em className="text-muted-foreground">(empty)</em>}</dd>
          <dt className="text-muted-foreground">Pages</dt>
          <dd>Home{enabled.length ? `, ${enabled.map((k) => PAGE_LABEL[k]).join(', ')}` : ''}</dd>
          <dt className="text-muted-foreground">Primary</dt>
          <dd>
            <span
              className="inline-block h-3 w-3 rounded-full border align-middle"
              style={{ background: state.color_primary }}
            />{' '}
            {state.color_primary}
          </dd>
          <dt className="text-muted-foreground">Accent</dt>
          <dd>
            <span
              className="inline-block h-3 w-3 rounded-full border align-middle"
              style={{ background: state.color_accent }}
            />{' '}
            {state.color_accent}
          </dd>
          <dt className="text-muted-foreground">Font</dt>
          <dd>{state.font_family}</dd>
          <dt className="text-muted-foreground">Contact</dt>
          <dd>{state.contact_email || <em className="text-muted-foreground">(empty)</em>}</dd>
          {state.formspree_id && (
            <>
              <dt className="text-muted-foreground">Formspree</dt>
              <dd>{state.formspree_id}</dd>
            </>
          )}
          <dt className="text-muted-foreground">Donate link</dt>
          <dd className="truncate">{state.stripe_link || <em className="text-muted-foreground">(empty)</em>}</dd>
          {state.custom_domain && (
            <>
              <dt className="text-muted-foreground">Domain</dt>
              <dd>{state.custom_domain}</dd>
            </>
          )}
        </dl>
      </section>

      <Button onClick={onDownload} disabled={downloading} size="lg" className="w-full">
        {downloading ? 'Building zip…' : 'Download site as .zip'}
      </Button>

      <p className="text-xs text-muted-foreground">
        The zip contains plain HTML, CSS, and assets. Unzip, drop the files into a{' '}
        <code className="rounded bg-muted px-1">username.github.io</code> repository on GitHub,
        and your site will be live at{' '}
        <code className="rounded bg-muted px-1">https://username.github.io</code>.
        See the included <code className="rounded bg-muted px-1">README.txt</code> for step-by-step instructions.
      </p>
    </div>
  );
}
