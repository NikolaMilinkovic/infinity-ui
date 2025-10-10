module.exports = {
  expo: {
    name: 'Infinity Boutique App',
    slug: 'infinity-boutique-app',
    backgroundColor: '#ffffff',
    version: '1.0.10',
    jsEngine: 'hermes',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    platforms: ['android', 'ios'],
    newArchEnabled: true,
    splash: {
      // image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    notification: {
      icon: './assets/notification.png',
      color: '#ffffff',
    },
    notifications: {
      icon: './assets/notification.png',
      color: '#ffffff',
    },
    plugins: [
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to add products images.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification.png',
          color: '#ffffff',
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      backgroundColor: '#ffffff',
      buildNumber: '1.0.0',
      bundleIdentifier: 'com.infinity.infinityboutiqueapp',
    },
    android: {
      backgroundColor: '#ffffff',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: [
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.RECORD_AUDIO',
        'RECEIVE_BOOT_COMPLETED',
        'VIBRATE',
      ],
      package: 'com.infinity.infinityboutiqueapp',
      googleServicesFile: process.env.EXPO_GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
    web: {
      favicon: './assets/infinity.png',
      backgroundColor: '#ffffff',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff',
      },
    },
    extra: {
      eas: {
        projectId: '426b99c7-d15c-4c36-bce4-daf8890090a4',
      },
      EXPO_PUBLIC_BACKEND_URI: 'https://infinity-server-b8ecd56d9909.herokuapp.com',
    },
    install: {
      exclude: [
        'react-native@~0.76.6',
        'react-native-reanimated@~3.16.1',
        'react-native-gesture-handler@~2.20.0',
        'react-native-screens@~4.4.0',
        'react-native-safe-area-context@~4.12.0',
        'react-native-webview@~13.12.5',
        'react-native-fs',
        'react-native-dropdown-select-list',
        'react-native-select-dropdown',
        'react-native-vector-icons',
        'socket.io-client',
        'xlsx',
      ],
    },
  },
};
