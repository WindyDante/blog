---
title: RSS美化
date: 2025-05-29 20:21:23
tags: RSS
---

RSS,高效率的阅读方式

它的全称是`简易内容聚合`，是一个让你在很多地方都能订阅各种各样感兴趣的工具

我们可以通过一些订阅工具，来针对你的文章订阅，订阅方式也很简单，只需要一个atom.xml或feed.xml，按照规定的格式去生成的RSS文件地址，通过一些特定的rss订阅工具:譬如[follow](https://follow.is)，来读取你的文章基本信息

针对于xml生成这里就不赘述了，因为这种都是统一规范的，生成起来并不复杂

想为xml生成格式，只需要为生成的xml头部修改为：
```xml
<?xml-stylesheet type="text/xsl" href="rss-style.xsl"?>
```

href简单理解是`渲染xml文件样式的位置`，我将该文件和rss生成的内容**放在一起**，就可以将rss指向的内容渲染到该文件中

下图是`rss.xml`与`rss-style.xsl`放在一起的情况

![image-20250529204251567](https://b.1wind.cn/2025/05/5768f536362ea890a0f2f347c602f426.png)

接着你只需要为xsl编写样式和内容渲染就可以了

如下是我的xsl内容，你可以复制这个xsl，基于xml去修改内容

```xsl
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/></title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            background: #fff;
            max-width: 680px;
            margin: 0 auto;
            padding: 60px 20px;
          }
          
          .header { 
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
          }
          
          .header h1 { 
            font-size: 2.5em;
            font-weight: 400;
            letter-spacing: -0.02em;
            margin-bottom: 15px;
            color: #000;
          }
          
          .channel-info { 
            font-size: 0.95em;
            color: #666;
            line-height: 1.6;
          }
          
          .channel-info p {
            margin-bottom: 8px;
          }
          
          .channel-info a {
            color: #333;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
          }
          
          .item { 
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .item:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          
          .title { 
            font-size: 1.4em;
            font-weight: 400;
            line-height: 1.4;
            margin-bottom: 12px;
          }
          
          .title a { 
            color: #000;
            text-decoration: none;
            border-bottom: 2px solid transparent;
            transition: border-color 0.2s ease;
          }
          
          .title a:hover { 
            border-bottom-color: #000;
          }
          
          .date { 
            font-size: 0.85em;
            color: #999;
            margin-bottom: 20px;
            font-style: italic;
          }
          
          .description { 
            color: #444;
            line-height: 1.8;
            font-size: 0.95em;
          }
          
          .description p {
            margin-bottom: 1em;
          }
          
          .description p:last-child {
            margin-bottom: 0;
          }
          
          @media (max-width: 600px) {
            body {
              padding: 40px 16px;
              font-size: 15px;
            }
            
            .header h1 {
              font-size: 2em;
            }
            
            .title {
              font-size: 1.25em;
            }
            
            .header {
              margin-bottom: 40px;
            }
            
            .item {
              margin-bottom: 35px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="rss/channel/title"/></h1>
          <div class="channel-info">
            <xsl:if test="rss/channel/description">
              <p><xsl:value-of select="rss/channel/description"/></p>
            </xsl:if>
            <xsl:if test="rss/channel/link">
              <p>网站: <a href="{rss/channel/link}" target="_blank"><xsl:value-of select="rss/channel/link"/></a></p>
            </xsl:if>
            <xsl:if test="rss/channel/lastBuildDate">
              <p>最后更新: <xsl:value-of select="rss/channel/lastBuildDate"/></p>
            </xsl:if>
          </div>
        </div>
        
        <xsl:for-each select="rss/channel/item">
          <article class="item">
            <h2 class="title">
              <xsl:choose>
                <xsl:when test="link">
                  <a href="{link}" target="_blank"><xsl:value-of select="title"/></a>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="title"/>
                </xsl:otherwise>
              </xsl:choose>
            </h2>
            <xsl:if test="pubDate">
              <div class="date">
                <xsl:value-of select="pubDate"/>
              </div>
            </xsl:if>
            <xsl:if test="description">
              <div class="description">
                <xsl:value-of select="description" disable-output-escaping="yes"/>
              </div>
            </xsl:if>
          </article>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

只要保持xml首行内容,路径正确,渲染无误,你就可以看到一个崭新的rss啦！

![image-20250529204748068](https://b.1wind.cn/2025/05/b5cbc069b0735dc86dc4948892638a77.png)

本文参考[六神的文章](https://blog.liushen.fun/posts/caee2d9f/)