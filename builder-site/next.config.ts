import type { NextConfig } from 'next';

/**
 * Static-export build of just the /builder route, intended for GitHub Pages.
 *
 * BUILDER_BASE_PATH should be set to the repository name when deploying to
 * https://<user>.github.io/<repo>/  (e.g. "/CharityWebsiteStarterKit").
 * Leave empty for custom-domain or user-pages deployments.
 */
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.BUILDER_BASE_PATH ?? '',
  assetPrefix: process.env.BUILDER_BASE_PATH ?? undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.BUILDER_BASE_PATH ?? '',
  },
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
};

export default config;
