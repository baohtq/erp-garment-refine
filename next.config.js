// Basic next.config.js without JSDoc
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Cấu hình turbo là một object thay vì boolean
    turbo: {
      loaders: {
        // Cấu hình turbo loaders nếu cần
      },
      rules: {
        // Cấu hình turbo rules nếu cần
      }
    }
  }
};