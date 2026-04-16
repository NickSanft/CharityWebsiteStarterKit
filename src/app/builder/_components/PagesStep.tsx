'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PAGE_KEYS, PAGE_LABEL, type BuilderState, type PageKey } from '@/lib/builder/schema';

export function PagesStep({
  state,
  update,
}: {
  state: BuilderState;
  update: (patch: Partial<BuilderState>) => void;
}) {
  function togglePage(key: PageKey, enabled: boolean) {
    update({ enabled_pages: { ...state.enabled_pages, [key]: enabled } });
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-md border bg-muted/40 p-4">
        <h3 className="font-medium">Include pages</h3>
        <p className="text-sm text-muted-foreground">
          Home is always included. Toggle the others on or off.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          {PAGE_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={state.enabled_pages[key]}
                onCheckedChange={(c) => togglePage(key, c === true)}
              />
              {PAGE_LABEL[key]}
            </label>
          ))}
        </div>
      </section>

      {/* Home */}
      <section className="space-y-3">
        <h3 className="font-medium">Home</h3>
        <Field label="Heading" value={state.home_heading} onChange={(v) => update({ home_heading: v })} />
        <Field label="Subheading" value={state.home_subheading} onChange={(v) => update({ home_subheading: v })} textarea />
        <Field label="Body" value={state.home_body} onChange={(v) => update({ home_body: v })} textarea rows={4} />
        <ImageField
          label="Hero image (optional)"
          value={state.home_hero_data_url}
          onChange={(v) => update({ home_hero_data_url: v })}
        />
      </section>

      {/* About */}
      {state.enabled_pages.about && (
        <section className="space-y-3">
          <h3 className="font-medium">About</h3>
          <Field label="Heading" value={state.about_heading} onChange={(v) => update({ about_heading: v })} />
          <Field label="Lead" value={state.about_lead} onChange={(v) => update({ about_lead: v })} textarea />
          <Field label="Body" value={state.about_body} onChange={(v) => update({ about_body: v })} textarea rows={4} />
          <ImageField
            label="About image (optional)"
            value={state.about_image_data_url}
            onChange={(v) => update({ about_image_data_url: v })}
          />
        </section>
      )}

      {/* Events */}
      {state.enabled_pages.events && (
        <section className="space-y-3">
          <h3 className="font-medium">Events</h3>
          <Field label="Heading" value={state.events_heading} onChange={(v) => update({ events_heading: v })} />
          <Field label="Lead" value={state.events_lead} onChange={(v) => update({ events_lead: v })} textarea />
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-md border p-3 space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Event {n}</div>
              <Field
                label="Title"
                value={state[`event${n}_title` as keyof BuilderState] as string}
                onChange={(v) => update({ [`event${n}_title`]: v } as Partial<BuilderState>)}
              />
              <Field
                label="Date"
                value={state[`event${n}_date` as keyof BuilderState] as string}
                onChange={(v) => update({ [`event${n}_date`]: v } as Partial<BuilderState>)}
              />
              <Field
                label="Description"
                textarea
                value={state[`event${n}_description` as keyof BuilderState] as string}
                onChange={(v) => update({ [`event${n}_description`]: v } as Partial<BuilderState>)}
              />
            </div>
          ))}
        </section>
      )}

      {/* Volunteer */}
      {state.enabled_pages.volunteer && (
        <section className="space-y-3">
          <h3 className="font-medium">Volunteer</h3>
          <Field label="Heading" value={state.volunteer_heading} onChange={(v) => update({ volunteer_heading: v })} />
          <Field label="Lead" value={state.volunteer_lead} onChange={(v) => update({ volunteer_lead: v })} textarea />
          <Field label="Body" value={state.volunteer_body} onChange={(v) => update({ volunteer_body: v })} textarea rows={4} />
        </section>
      )}

      {/* Donate */}
      {state.enabled_pages.donate && (
        <section className="space-y-3">
          <h3 className="font-medium">Donate</h3>
          <Field label="Heading" value={state.donate_heading} onChange={(v) => update({ donate_heading: v })} />
          <Field label="Lead" value={state.donate_lead} onChange={(v) => update({ donate_lead: v })} textarea />
          <Field label="Body" value={state.donate_body} onChange={(v) => update({ donate_body: v })} textarea rows={3} />
        </section>
      )}

      {/* Blog */}
      {state.enabled_pages.blog && (
        <section className="space-y-3">
          <h3 className="font-medium">Blog</h3>
          <Field label="Heading" value={state.blog_heading} onChange={(v) => update({ blog_heading: v })} />
          <Field label="Lead" value={state.blog_lead} onChange={(v) => update({ blog_lead: v })} textarea />
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-md border p-3 space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Post {n}</div>
              <Field
                label="Title"
                value={state[`blog${n}_title` as keyof BuilderState] as string}
                onChange={(v) => update({ [`blog${n}_title`]: v } as Partial<BuilderState>)}
              />
              <Field
                label="Date"
                value={state[`blog${n}_date` as keyof BuilderState] as string}
                onChange={(v) => update({ [`blog${n}_date`]: v } as Partial<BuilderState>)}
              />
              <Field
                label="Body"
                textarea
                value={state[`blog${n}_body` as keyof BuilderState] as string}
                onChange={(v) => update({ [`blog${n}_body`]: v } as Partial<BuilderState>)}
              />
            </div>
          ))}
        </section>
      )}

      {/* Contact */}
      {state.enabled_pages.contact && (
        <section className="space-y-3">
          <h3 className="font-medium">Contact</h3>
          <Field label="Heading" value={state.contact_heading} onChange={(v) => update({ contact_heading: v })} />
          <Field label="Lead" value={state.contact_lead} onChange={(v) => update({ contact_lead: v })} textarea />
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      {textarea ? (
        <Textarea id={id} rows={rows ?? 2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  }
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type="file" accept="image/*" onChange={onFile} />
      {value ? (
        <div className="mt-1 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-16 w-auto rounded border bg-white object-cover" />
          <button type="button" className="text-xs text-muted-foreground underline" onClick={() => onChange('')}>
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
