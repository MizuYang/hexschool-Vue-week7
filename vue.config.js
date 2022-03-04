module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/hexschool-Vue-week7/'
    : '/',

  configureWebpack: {
    performance: {
      hints: false
    }
  }
}
