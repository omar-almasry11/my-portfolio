module.exports = function (eleventyConfig) {
  // Add a passthrough copy for assets or other folders
  eleventyConfig.addPassthroughCopy("dist");

  // Watch the CSS directory for changes
  eleventyConfig.addWatchTarget("src/styles/**/*.css");

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