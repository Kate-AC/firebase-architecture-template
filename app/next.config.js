/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  devServer: {
    port: 51001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 5000,
      aggregateTimeout: 500,
      ignored: ['node_modules']
    }
    return config
  }
}

module.exports = nextConfig
