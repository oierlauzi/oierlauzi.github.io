module.exports = {
  publicPath: '/',
  outputDir: 'dist',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  },

  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts',
      title: 'Oier Lauzirika Zarrabeitia',
    },
  }
}
