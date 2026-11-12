// The site's own address, for the sitemap and robots.txt. On Vercel this is
// the production domain (bufala.app once it is connected); elsewhere, the
// local server.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
