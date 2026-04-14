'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BuilderState } from '@/lib/builder/schema';

export function BasicsStep({
  state,
  update,
}: {
  state: BuilderState;
  update: (patch: Partial<BuilderState>) => void;
}) {
  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ logo_data_url: String(reader.result ?? '') });
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="charity_name">Charity name</Label>
        <Input
          id="charity_name"
          value={state.charity_name}
          onChange={(e) => update({ charity_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Textarea
          id="tagline"
          rows={2}
          value={state.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color_primary">Primary color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="color_primary"
              className="h-10 w-14 cursor-pointer rounded border"
              value={state.color_primary}
              onChange={(e) => update({ color_primary: e.target.value })}
            />
            <Input
              value={state.color_primary}
              onChange={(e) => update({ color_primary: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color_accent">Accent color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="color_accent"
              className="h-10 w-14 cursor-pointer rounded border"
              value={state.color_accent}
              onChange={(e) => update({ color_accent: e.target.value })}
            />
            <Input
              value={state.color_accent}
              onChange={(e) => update({ color_accent: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font_family">Font family</Label>
        <select
          id="font_family"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={state.font_family}
          onChange={(e) => update({ font_family: e.target.value })}
        >
          <option value="Inter">Inter (modern sans)</option>
          <option value="Georgia">Georgia (classic serif)</option>
          <option value="Verdana">Verdana (friendly sans)</option>
          <option value="system-ui">System default</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo (PNG/SVG, optional)</Label>
        <Input id="logo" type="file" accept="image/*" onChange={onLogo} />
        {state.logo_data_url ? (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={state.logo_data_url} alt="Logo preview" className="h-12 w-auto rounded border bg-white p-1" />
            <button
              type="button"
              className="text-xs text-muted-foreground underline"
              onClick={() => update({ logo_data_url: '' })}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
