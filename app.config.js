module.exports = ({ config }) => {
  const PRODUCT_NAME = 'Core Expo';
  const BUNDLE_IDENTIFIER = 'com.longdech.coreexpo';

  return {
    ...config,
    name: PRODUCT_NAME,
    slug: 'core-react-native-expo',
    version: '1.0.0',
    orientation: 'default', // 'default', 'portrait', 'landscape'
    icon: './src/assets/images/icon.png',
    scheme: 'core-react-native-expo',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splash-icon.png',
      // "image": "./src/assets/images/splash-icon-light.png",
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      // googleServicesFile: './GoogleService-Info.plist',
      // "icon": {
      //   "dark": "./src/assets/images/ios-dark.png",
      //   "light": "./src/assets/images/ios-light.png",
      //   "tinted": "./src/assets/images/ios-tinted.png"
      // }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      softwareKeyboardLayoutMode: 'resize',
      package: BUNDLE_IDENTIFIER,
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
      //       './src/assets/fonts/Google_Sans/GoogleSans-Regular.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-Medium.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-SemiBold.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-Bold.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-Italic.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-MediumItalic.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-SemiBoldItalic.ttf',
      //       './src/assets/fonts/Google_Sans/GoogleSans-BoldItalic.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Regular.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Medium.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBold.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Bold.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-Italic.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-MediumItalic.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-SemiBoldItalic.ttf',
      //       './src/assets/fonts/Be_Vietnam_Pro/BeVietnamPro-BoldItalic.ttf',
      //       './src/assets/fonts/Roboto/Roboto-Regular.ttf',
      //       './src/assets/fonts/Roboto/Roboto-Italic.ttf',
      //       './src/assets/fonts/Roboto/Roboto-Medium.ttf',
      //       './src/assets/fonts/Roboto/Roboto-MediumItalic.ttf',
      //       './src/assets/fonts/Roboto/Roboto-SemiBold.ttf',
      //       './src/assets/fonts/Roboto/Roboto-SemiBoldItalic.ttf',
      //       './src/assets/fonts/Roboto/Roboto-Bold.ttf',
      //       './src/assets/fonts/Roboto/Roboto-BoldItalic.ttf',
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
      [
        'expo-secure-store',
        {
          configureAndroidBackup: true,
          faceIDPermission: `Cho phép ${PRODUCT_NAME} truy cập vào Face ID của bạn.`,
          biometricPermission: `Cho phép ${PRODUCT_NAME} truy cập vào biometric của bạn.`,
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
