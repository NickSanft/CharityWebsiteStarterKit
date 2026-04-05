import { prisma } from '@/lib/prisma';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

export async function ThemeStyle() {
  let css = '';

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (settings) {
      const overrides: string[] = [];
      if (settings.primaryColor) {
        const rgb = hexToRgb(settings.primaryColor);
        if (rgb) overrides.push(`--primary: ${rgb}; --ring: ${rgb};`);
      }
      if (settings.secondaryColor) {
        const rgb = hexToRgb(settings.secondaryColor);
        if (rgb) overrides.push(`--secondary: ${rgb};`);
      }
      if (overrides.length > 0) {
        css = `:root { ${overrides.join(' ')} }`;
      }
    }
  } catch {
    // Database may not be ready yet
  }

  // Always render the style tag to avoid hydration mismatch
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
