module.exports = {
  plugins: [
    require("autoprefixer"), // Adds vendor prefixes
    require("postcss-nesting"), // Enable Nesting
    require("postcss-preset-env")({
      stage: 1, // Enabling upcomming CSS features
      features: {
        "nesting-rules": false,
      },
    }),
  ],
};
