// Vercel serverless function: serves sitemap as XML so crawlers always get application/xml
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://vertexbdcltd.com/</loc>
    <lastmod>2026-03-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/automotive-bdc</loc>
    <lastmod>2026-03-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/services</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/contact</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/why-us</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/solar-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/rv-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/roofing-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/real-estate-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/saas-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/logistics-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/financial-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/tech-stack</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcltd.com/careers</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

module.exports = function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(SITEMAP);
  } catch (err) {
    res.status(500).setHeader('Content-Type', 'text/plain').send('Sitemap error');
  }
};
