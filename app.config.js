module.exports = ({ config }) => {
  return {
    ...config,
    name: 'mobile',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'all',
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
      //   'expo-font',
      //   {
      //     fonts: [
      //       './assets/fonts/Google_Sans/GoogleSans-Regular.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-Medium.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-SemiBold.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-Bold.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-Italic.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-MediumItalic.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-SemiBoldItalic.ttf',
      //       './assets/fonts/Google_Sans/GoogleSans-BoldItalic.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Regular.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Medium.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBold.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Bold.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Italic.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-MediumItalic.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBoldItalic.ttf',
      //       './assets/fonts/Be_Vietnam_Pro/BeVietnamPro-BoldItalic.ttf',
      //       './assets/fonts/Roboto/Roboto-Regular.ttf',
      //       './assets/fonts/Roboto/Roboto-Italic.ttf',
      //       './assets/fonts/Roboto/Roboto-Medium.ttf',
      //       './assets/fonts/Roboto/Roboto-MediumItalic.ttf',
      //       './assets/fonts/Roboto/Roboto-SemiBold.ttf',
      //       './assets/fonts/Roboto/Roboto-SemiBoldItalic.ttf',
      //       './assets/fonts/Roboto/Roboto-Bold.ttf',
      //       './assets/fonts/Roboto/Roboto-BoldItalic.ttf',
      //     ],
      //   },
      // ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
