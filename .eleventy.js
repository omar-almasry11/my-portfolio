module.exports = function (eleventyConfig) {
  // Add a passthrough copy for assets or other folders
  eleventyConfig.addPassthroughCopy("dist");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });  

  // Watch the CSS directory for changes
  eleventyConfig.addWatchTarget("src/styles/**/*.css");

  // Add a global shortcode to get the current year
  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  // Set Liquid options to enable dynamic partials
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true, // Enable dynamic partials
    strictFilters: false,  // Optional: Allow loose filtering
  });

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