module.exports = {
  expo: {
    name: 'Infinity Boutique App',
    slug: 'infinity-boutique-app',
    backgroundColor: '#ffffff',
    version: '1.0.9',
    jsEngine: 'hermes',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    platforms: ['android'],
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    notification: {
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
      googleServicesFile: process.env.EXPO_GOOGLE_SERVICES_JSON ?? './android/app/google-services.json',
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
  },
};
