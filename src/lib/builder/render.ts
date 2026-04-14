import type { BuilderState, PageKey } from './schema';

export interface TemplateFile {
  path: string;
  encoding: 'utf8' | 'base64';
  content: string;
}

export interface TemplateManifest {
  generatedAt: string;
  files: TemplateFile[];
}

export interface RenderContext {
  state: BuilderState;
  /** Maps flag name -> boolean, used by <!--IF:flag-->...<!--ENDIF--> blocks. */
  flags: Record<string, boolean>;
  /** Token -> replacement value. */
  tokens: Record<string, string>;
}

export function buildRenderContext(state: BuilderState): RenderContext {
  const flags: Record<string, boolean> = {
    page_about: state.enabled_pages.about,
    page_events: state.enabled_pages.events,
    page_volunteer: state.enabled_pages.volunteer,
    page_donate: state.enabled_pages.donate,
    page_contact: state.enabled_pages.contact,
    social_twitter: state.social_twitter.trim().length > 0,
    social_facebook: state.social_facebook.trim().length > 0,
    social_instagram: state.social_instagram.trim().length > 0,
  };

  const tokens: Record<string, string> = {
    charity_name: state.charity_name,
    tagline: state.tagline,
    color_primary: state.color_primary,
    color_accent: state.color_accent,
    font_family: state.font_family,
    year: String(new Date().getFullYear()),

    home_heading: state.home_heading,
    home_subheading: state.home_subheading,
    home_body: state.home_body,

    about_heading: state.about_heading,
    about_lead: state.about_lead,
    about_body: state.about_body,

    events_heading: state.events_heading,
    events_lead: state.events_lead,
    event1_title: state.event1_title,
    event1_date: state.event1_date,
    event1_description: state.event1_description,
    event2_title: state.event2_title,
    event2_date: state.event2_date,
    event2_description: state.event2_description,
    event3_title: state.event3_title,
    event3_date: state.event3_date,
    event3_description: state.event3_description,

    volunteer_heading: state.volunteer_heading,
    volunteer_lead: state.volunteer_lead,
    volunteer_body: state.volunteer_body,

    donate_heading: state.donate_heading,
    donate_lead: state.donate_lead,
    donate_body: state.donate_body,
    stripe_link: state.stripe_link,

    contact_heading: state.contact_heading,
    contact_lead: state.contact_lead,
    contact_email: state.contact_email,

    social_twitter: state.social_twitter,
    social_facebook: state.social_facebook,
    social_instagram: state.social_instagram,
  };

  return { state, flags, tokens };
}

const IF_BLOCK = /<!--IF:([a-z0-9_]+)-->([\s\S]*?)<!--ENDIF-->/g;
const TOKEN = /\{\{\s*([a-z0-9_]+)\s*\}\}/g;

/**
 * Apply {{tokens}} and <!--IF:flag-->...<!--ENDIF--> blocks to a template string.
 * Missing tokens resolve to empty string. Unknown flags are treated as false.
 */
export function applyTemplate(source: string, ctx: RenderContext): string {
  const withIfs = source.replace(IF_BLOCK, (_m, flag: string, body: string) =>
    ctx.flags[flag] ? body : '',
  );
  return withIfs.replace(TOKEN, (_m, key: string) =>
    Object.prototype.hasOwnProperty.call(ctx.tokens, key) ? ctx.tokens[key] : '',
  );
}

/**
 * Render a single page by its filename (e.g. 'index.html') from the manifest.
 * Returns null if the file isn't in the manifest or isn't utf8.
 */
export function renderPage(
  manifest: TemplateManifest,
  filename: string,
  ctx: RenderContext,
): string | null {
  const file = manifest.files.find((f) => f.path === filename);
  if (!file || file.encoding !== 'utf8') return null;
  return applyTemplate(file.content, ctx);
}

/**
 * Build an inline preview HTML string for a given page.
 * Inlines styles.css and swaps image references so the iframe can render
 * without fetching any sibling files.
 */
export function renderPreview(
  manifest: TemplateManifest,
  pageFile: string,
  ctx: RenderContext,
): string {
  const pageHtml = renderPage(manifest, pageFile, ctx);
  if (pageHtml == null) return '<!doctype html><title>Preview unavailable</title>';

  const cssFile = manifest.files.find((f) => f.path === 'styles.css');
  const css = cssFile && cssFile.encoding === 'utf8' ? applyTemplate(cssFile.content, ctx) : '';

  const logoSrc = ctx.state.logo_data_url || transparentPixel();

  // Replace external stylesheet link with inline <style>, and swap logo src.
  return pageHtml
    .replace(/<link rel="stylesheet" href="styles\.css" \/>/, `<style>${css}</style>`)
    .replace(/src="assets\/logo\.png"/g, `src="${logoSrc}"`)
    .replace(/href="assets\/favicon\.png"/g, 'href="#"')
    // Rewrite cross-page links so nav clicks don't navigate away inside the iframe.
    .replace(/href="(index|about|events|volunteer|donate|contact)\.html"/g, 'href="#$1"');
}

function transparentPixel() {
  return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
}

export function pageFileFor(key: 'home' | PageKey): string {
  if (key === 'home') return 'index.html';
  return `${key}.html`;
}
