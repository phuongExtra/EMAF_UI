module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/scss/_helper.scss";
        `,
      },
      sass: {
        additionalData: `
          @import "@/scss/_helper.scss";
        `,
      },
    },
  },
  devServer: {
    compress: true,
    disableHostCheck: true,
  },
};
