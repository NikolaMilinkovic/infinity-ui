module.exports = {
  expo: {
    name: 'Infinity Boutique App',
    slug: 'infinity-boutique-app',
    backgroundColor: '#ffffff',
    version: '1.1.0',
    jsEngine: 'hermes',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    platforms: ['android', 'ios'],
    newArchEnabled: true,
    splash: {
      resizeMode: 'contain',
      image: './assets/splash.png',
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
        'expo-build-properties',
        {
          android: {
            agpVersion: '8.7.3',
          },
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification.png',
          color: '#ffffff',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            ndkVersion: '26.1.10909125',
            extraCmakeArgs: ['-DANDROID_STL=c++_shared'],
          },
        },
      ],
      [
        'expo-custom-agp',
        {
          version: '8.7.3',
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      backgroundColor: '#ffffff',
      buildNumber: '1.0.0',
      bundleIdentifier: 'com.infinity.infinityboutiqueapp',
      infoPlist: {
        NSPhotoLibraryUsageDescription: 'This app requires access to your photos to share images.',
        NSPhotoLibraryAddUsageDescription: 'This app needs permission to save photos.',
      },
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
  },
};
