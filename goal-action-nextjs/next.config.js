const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    reactStrictMode: true,
    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = {fs: false};
      return config
    }
  }, 
}