module.exports = function (eleventyConfig) {
  // Add a passthrough copy for assets or other folders
  eleventyConfig.addPassthroughCopy("dist");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Newest posts first
    });
  }); 
  
  // New case studies collection
eleventyConfig.addCollection("caseStudies", function (collectionApi) {
  return collectionApi.getFilteredByGlob("src/case-studies/*.md").sort((a, b) => {
    // Sort by `order` field, and fall back to `date` if `order` is not defined
    const orderA = a.data.order || Number.MAX_SAFE_INTEGER;
    const orderB = b.data.order || Number.MAX_SAFE_INTEGER;

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