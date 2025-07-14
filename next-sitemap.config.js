/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://us1-black.vercel.app', // ✅ bez / na kraju
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
}
