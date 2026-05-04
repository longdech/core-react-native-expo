module.exports = ({ config }) => {
  return {
    ...config,
    name: 'mobile',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'mobile',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      softwareKeyboardLayoutMode: 'resize',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './src/assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      // TODO: Uncomment this when we have the font files for production build
      // [
      //   "expo-font",
      //   {
      //     "fonts": [
      //       "./assets/fonts/google-sans/static/GoogleSans-Regular.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-Medium.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-SemiBold.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-Bold.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-Italic.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-MediumItalic.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-SemiBoldItalic.ttf",
      //       "./assets/fonts/google-sans/static/GoogleSans-BoldItalic.ttf"
      //     ]
      //   }
      // ]
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
