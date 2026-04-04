import { prisma } from '@/lib/prisma';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

export async function ThemeStyle() {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  } catch {
    // Database may not be ready yet
  }

  if (!settings) return null;

  const overrides: string[] = [];
  if (settings.primaryColor) {
    const rgb = hexToRgb(settings.primaryColor);
    if (rgb) overrides.push(`--primary: ${rgb}; --ring: ${rgb};`);
  }
  if (settings.secondaryColor) {
    const rgb = hexToRgb(settings.secondaryColor);
    if (rgb) overrides.push(`--secondary: ${rgb};`);
  }

  if (overrides.length === 0) return null;

  return <style dangerouslySetInnerHTML={{ __html: `:root { ${overrides.join(' ')} }` }} />;
}
