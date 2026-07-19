<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" indent="yes" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap — Bedouin Trails</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f0; color: #333; padding: 2rem; }
          h1 { font-size: 1.5rem; margin-bottom: .25rem; color: #1a1a1a; }
          p.meta { color: #666; margin-bottom: 1.5rem; font-size: .875rem; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
          th { background: #2c2c2c; color: #fff; text-align: left; padding: .75rem 1rem; font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; }
          td { padding: .6rem 1rem; border-bottom: 1px solid #eee; font-size: .85rem; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #fafaf5; }
          a { color: #b8860b; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .priority { font-weight: 600; }
          .high { color: #2e7d32; }
          .medium { color: #b8860b; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <p class="meta">
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> URLs
        </p>
        <table>
          <tr>
            <th>#</th>
            <th>URL</th>
            <th>Priority</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td><xsl:value-of select="position()" /></td>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></td>
              <td>
                <xsl:attribute name="class">
                  priority <xsl:choose>
                    <xsl:when test="sitemap:priority = 1.0">high</xsl:when>
                    <xsl:otherwise>medium</xsl:otherwise>
                  </xsl:choose>
                </xsl:attribute>
                <xsl:value-of select="sitemap:priority" />
              </td>
              <td><xsl:value-of select="substring(sitemap:lastmod, 1, 10)" /></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
