const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Markdown = require("markdown-it");
const markdownEmoji = require("markdown-it-emoji");
const markdownLinks = require("markdown-it-anchor");
const markdownTableOfContents = require("markdown-it-table-of-contents");
const markdownModify = require("markdown-it-modify-token");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images/**");
  eleventyConfig.addPassthroughCopy("styles/**");
  eleventyConfig.addPassthroughCopy("_headers");

  const markdownConverter = new Markdown({
    html: true,
    modifyToken: (token) => {
      switch (token.type) {
        case "image":
          token.attrObj.loading = "lazy";
          token.attrObj.decoding = "async";
          break;
        case "link_open":
          if (!token.attrObj?.class?.includes("header-anchor")) {
            token.attrObj.target = "_blank";
            token.attrObj.rel = "noopener noreferrer";
            break;
          }
      }
    }
  })
  markdownConverter.use(markdownEmoji);
  markdownConverter.use(markdownLinks, {
    tabIndex: false,
    permalink: markdownLinks.permalink.headerLink()
  });
  markdownConverter.use(markdownTableOfContents, {
    markerPattern: /^\[Table Of Contents\]\(\)/m,
    listType: "ol",
    containerHeaderHtml: "<h2><a class=\"header-anchor\" href=\"#contents\">Contents</a></h2>"
  });
  markdownConverter.use(markdownModify);
  eleventyConfig.setLibrary("md", markdownConverter);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("readTime", (content) => {
    const imagesMatches = content.match(/!\[.+\]\(.+\)/g);
    const images = (imagesMatches ? imagesMatches.length : 0);
    const words = content.split(" ").length;

    const imageTime = images * 12;
    const wordTime = words / 5;
    const time = Math.round((imageTime + wordTime) / 60);
    if (time < 1) {
      return 1
    }
    return time
  });

  eleventyConfig.addFilter("keywordTags", (content) => {
    return JSON.stringify(content.split(",").map((tag) => `Tag:${tag.trim()}`))
  });

  eleventyConfig.addFilter("formatDate", (content, format) => {
    switch (format) {
      case "ISOString":
        return content.toISOString()
      case "LocaleDateString":
        return content.toLocaleDateString("en-GB", { dateStyle: "long" })
      case "UTCString":
        return content.toUTCString()
      case "Date":
        return content.toISOString().split("T")[0]
      default:
        return content
    }
  })

  eleventyConfig.addFilter("maxDate", (collection, format) => {
    const latest = collection.sort((a, b) => b.date - a.date)[0];
    switch (format) {
      case "UTCString":
        return latest.date.toUTCString()
      case "Date":
        return latest.date.toISOString().split("T")[0]
      default:
        return latest.date
    }
  });

};
