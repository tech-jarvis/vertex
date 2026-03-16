// Vercel serverless function: serves sitemap as XML so crawlers always get application/xml
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://vertexbdcllc.com/</loc>
    <lastmod>2026-03-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/automotive-bdc</loc>
    <lastmod>2026-03-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/services</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/contact</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/why-us</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/solar-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/rv-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/roofing-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/real-estate-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/saas-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/logistics-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/financial-bdc</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/tech-stack</loc>
    <lastmod>2026-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vertexbdcllc.com/careers</loc>
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
