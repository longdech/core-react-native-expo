module.exports = ({ config }) => {
  return {
    ...config,
    name: 'Core Expo',
    slug: 'core-react-native-expo',
    version: '1.0.0',
    orientation: 'default', // 'default', 'portrait', 'landscape'
    icon: './src/assets/images/icon.png',
    scheme: 'core-react-native-expo',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.longdech.coreexpo',
      // googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      softwareKeyboardLayoutMode: 'resize',
      package: 'com.longdech.coreexpo',
      googleServicesFile: './google-services.json',
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
      [
        'expo-notifications',
        {
          icon: './src/assets/images/notification-icon.png',
          color: '#ffffff',
          defaultChannel: 'default',
          // enableBackgroundRemoteNotifications: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '4b10bd6e-9280-4a65-b3a8-ee0b114cbb4e',
      },
    },
  };
};
