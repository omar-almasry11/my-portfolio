const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTOC = require("markdown-it-table-of-contents");

module.exports = function (eleventyConfig) {
  // Add a passthrough copy for assets or other folders
  eleventyConfig.addPassthroughCopy("dist");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/scripts");

  // Blog posts collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Newest posts first
    });
  });

  // Case studies collection
  eleventyConfig.addCollection("caseStudies", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/case-studies/*.md").sort((a, b) => {
      // Sort by `order` field, and fall back to `date` if `order` is not defined
      const orderA = a.data.order || Number.MAX_SAFE_INTEGER;
      const orderB = a.data.order || Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB; // Sort ascending by `order`
      }

      // If orders are equal or undefined, sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });
  });

  // Watch the CSS directory for changes
  eleventyConfig.addWatchTarget("src/styles/**/*.css");

  // Add a global shortcode to get the current year
  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Markdown Configuration for Table of Contents
let markdownLib = markdownIt({ html: true })
.use(markdownItAnchor, {
  permalink: false, 
})
.use(markdownItTOC, {
  includeLevel: [2, 3], // TOC includes h2 and h3
  containerClass: "toc", // Adds a class for styling
  listType: "ul", // Uses unordered list (to remove bullet points)
  format: (content) => content, // Keeps original text
  markerPattern: /^\[\[toc\]\]/im, // Use [[toc]] as the marker to insert TOC
  containerHeaderHtml: "<h2 class='text-lg font-bold mb-3 text-primary dark:text-primaryInverted'>Table of Contents</h2>"
});

eleventyConfig.setLibrary("md", markdownLib);

  return {
    dir: {
      input: "src", // Source folder
      output: "_site", // Output folder
      includes: "_includes", // Includes folder
    },
    // Specify Liquid as the template engine
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
  };
};