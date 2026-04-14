'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BuilderState } from '@/lib/builder/schema';

export function IntegrationsStep({
  state,
  update,
}: {
  state: BuilderState;
  update: (patch: Partial<BuilderState>) => void;
}) {
  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <Label htmlFor="contact_email">Contact email</Label>
        <Input
          id="contact_email"
          type="email"
          value={state.contact_email}
          onChange={(e) => update({ contact_email: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Used on the Contact page and the volunteer "Get in touch" button.
        </p>
      </section>

      <section className="space-y-2">
        <Label htmlFor="stripe_link">Stripe payment link</Label>
        <Input
          id="stripe_link"
          type="url"
          placeholder="https://donate.stripe.com/..."
          value={state.stripe_link}
          onChange={(e) => update({ stripe_link: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Create one at dashboard.stripe.com → Payment links. The "Donate" button links here.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">Social links (optional)</h3>
        <div className="space-y-2">
          <Label htmlFor="social_twitter" className="text-xs">Twitter / X URL</Label>
          <Input
            id="social_twitter"
            type="url"
            value={state.social_twitter}
            onChange={(e) => update({ social_twitter: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social_facebook" className="text-xs">Facebook URL</Label>
          <Input
            id="social_facebook"
            type="url"
            value={state.social_facebook}
            onChange={(e) => update({ social_facebook: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="social_instagram" className="text-xs">Instagram URL</Label>
          <Input
            id="social_instagram"
            type="url"
            value={state.social_instagram}
            onChange={(e) => update({ social_instagram: e.target.value })}
          />
        </div>
      </section>
    </div>
  );
}
