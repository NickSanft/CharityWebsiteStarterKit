import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { applyTemplate, buildRenderContext, type TemplateManifest } from './render';
import { PAGE_FILE, PAGE_KEYS, type BuilderState } from './schema';

const TEXT_EXTS_FOR_TEMPLATING = new Set(['.html', '.css', '.txt', '.md', '.svg']);

function ext(path: string): string {
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot).toLowerCase();
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'charity-website'
  );
}

interface DataUrlParts {
  mime: string;
  extension: string;
  bytes: Uint8Array;
}

function parseDataUrl(dataUrl: string): DataUrlParts | null {
  const m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1] ?? 'application/octet-stream';
  const isBase64 = !!m[2];
  const raw = m[3];
  const bytes = isBase64 ? base64ToBytes(raw) : new TextEncoder().encode(decodeURIComponent(raw));
  const extension = mimeToExt(mime);
  return { mime, extension, bytes };
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    default:
      return 'png';
  }
}

/**
 * Returns the set of HTML files that should be included in the output,
 * based on which pages the user enabled. index.html is always included.
 */
function enabledHtmlFiles(state: BuilderState): Set<string> {
  const set = new Set<string>(['index.html']);
  for (const key of PAGE_KEYS) {
    if (state.enabled_pages[key]) set.add(PAGE_FILE[key]);
  }
  return set;
}

export async function buildAndDownloadZip(
  manifest: TemplateManifest,
  state: BuilderState,
): Promise<void> {
  const ctx = buildRenderContext(state);
  const zip = new JSZip();
  const htmlAllowed = enabledHtmlFiles(state);

  // User-uploaded logo / favicon: figure out final extension + bytes now so
  // we can rewrite HTML references to match.
  const logoParts = state.logo_data_url ? parseDataUrl(state.logo_data_url) : null;
  const faviconParts = state.favicon_data_url ? parseDataUrl(state.favicon_data_url) : null;
  const logoFinalPath = logoParts ? `assets/logo.${logoParts.extension}` : 'assets/logo.svg';
  const faviconFinalPath = faviconParts
    ? `assets/favicon.${faviconParts.extension}`
    : 'assets/favicon.svg';

  for (const file of manifest.files) {
    // Skip HTML pages the user disabled.
    if (file.path.endsWith('.html') && !htmlAllowed.has(file.path)) continue;

    // Skip default logo/favicon if the user uploaded a replacement with a
    // different extension (we'll write the user's file below).
    if (file.path === 'assets/logo.svg' && logoParts && logoParts.extension !== 'svg') continue;
    if (file.path === 'assets/favicon.svg' && faviconParts && faviconParts.extension !== 'svg') continue;

    if (file.encoding === 'utf8') {
      let content = file.content;
      const shouldTemplate = TEXT_EXTS_FOR_TEMPLATING.has(ext(file.path));

      // If user uploaded a replacement with a different extension, write their
      // bytes at the correct path and rewrite HTML references accordingly.
      if (file.path === 'assets/logo.svg' && logoParts && logoParts.extension === 'svg') {
        // Same extension — overwrite contents below with user bytes (skip templating).
        zip.file(logoFinalPath, logoParts.bytes);
        continue;
      }
      if (file.path === 'assets/favicon.svg' && faviconParts && faviconParts.extension === 'svg') {
        zip.file(faviconFinalPath, faviconParts.bytes);
        continue;
      }

      if (shouldTemplate) content = applyTemplate(content, ctx);

      // Rewrite asset references in HTML if extensions changed.
      if (file.path.endsWith('.html')) {
        if (logoParts && logoParts.extension !== 'svg') {
          content = content.replace(/assets\/logo\.svg/g, logoFinalPath);
        }
        if (faviconParts && faviconParts.extension !== 'svg') {
          content = content.replace(/assets\/favicon\.svg/g, faviconFinalPath);
        }
      }

      zip.file(file.path, content);
    } else {
      zip.file(file.path, base64ToBytes(file.content));
    }
  }

  // Write user-uploaded assets (non-svg extensions handled here).
  if (logoParts && logoParts.extension !== 'svg') {
    zip.file(logoFinalPath, logoParts.bytes);
  }
  if (faviconParts && faviconParts.extension !== 'svg') {
    zip.file(faviconFinalPath, faviconParts.bytes);
  }

  // Per-page images (hero, about, etc.)
  if (state.home_hero_data_url) {
    const parts = parseDataUrl(state.home_hero_data_url);
    if (parts) zip.file(`assets/home-hero.${parts.extension}`, parts.bytes);
  }
  if (state.about_image_data_url) {
    const parts = parseDataUrl(state.about_image_data_url);
    if (parts) zip.file(`assets/about-image.${parts.extension}`, parts.bytes);
  }

  // Custom domain CNAME file.
  if (state.custom_domain.trim()) {
    zip.file('CNAME', state.custom_domain.trim() + '\n');
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  saveAs(blob, `${slug(state.charity_name)}-site.zip`);
}
