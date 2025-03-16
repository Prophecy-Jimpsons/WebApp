module.exports = {
  plugins: [
    require("autoprefixer"), // Adds vendor prefixes
    require("postcss-nesting"), // Enable Nesting
    require("postcss-preset-env")({
      stage: 1, // Enabling upcoming CSS features
      features: {
        "nesting-rules": false,
      },
    }),
  ],
};
