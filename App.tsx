import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import { KeyboardProvider, KeyboardToolbar } from 'react-native-keyboard-controller';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StartupOverlay from './components/loading/StartupOverlay';
import { Colors } from './constants/colors';
import AuthStack from './navigation/AuthStack';
import AuthenticatedStack from './navigation/AuthenticatedStack';
import ContextProvider from './store/ContextProvider';
import { AuthContext } from './store/auth-context';
import { SocketContext } from './store/socket-context';
import { PopupMessagesComponent } from './util-components/PopupMessage';
SplashScreen.preventAutoHideAsync();

// Suppresses the VirtualizedList nesting warning
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

/**
 * Handles different Navigation Stack based on isAuthenticated flag in the context
 * Itterates between AuthStack & AuthenticatedStack
 */
function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  /**
   * Makes the native splash screen remain visible until hideAsync is called.
   */
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const authCtx = useContext(AuthContext);
  const socketCtx = useContext(SocketContext);

  /**
   * Checks the token in the AsyncStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          socketCtx?.socket?.connect();
          authCtx.authenticate(token);
        } else {
          socketCtx?.socket?.disconnect();
          authCtx.logout();
        }
      } catch (err) {
        console.error('Error while checking token:', err);
        socketCtx?.socket?.disconnect();
        authCtx.logout();
      } finally {
        setIsCheckingToken(false);
        await SplashScreen.hideAsync();
      }
    }

    getToken();
  }, [authCtx]);

  /**
   * Hide spash screen on app load
   */
  const onLayoutRootView = useCallback(async () => {
    if (!isCheckingToken) {
      try {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
      } catch (err) {
        console.error('Error hiding splash screen:', err);
      }
    }
  }, [isCheckingToken]);

  const [showFakeSplash, setShowFakeSplash] = useState(true);

  return (
    // <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* App content renders in the background */}
      {!isCheckingToken && (
        <>
          <PopupMessagesComponent />
          {/* <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.primaryLight }}>
            <SocketDcRc />
          </SafeAreaView> */}
          <Navigation />
        </>
      )}

      {/* Fake splash overlays the whole screen and fades out */}
      {showFakeSplash && <StartupOverlay onFinish={() => setShowFakeSplash(false)} />}
    </View>
  );
}

export default function App() {
  useFonts({
    'Playfair-Regular': require('./assets/fonts/playfair/PlayfairDisplay-Regular.ttf'),
    'Playfair-Bold': require('./assets/fonts/playfair/PlayfairDisplay-Bold.ttf'),
    'Playfair-Black': require('./assets/fonts/playfair/PlayfairDisplay-Black.ttf'),
    'HelveticaNeue-Regular': require('./assets/fonts/helveticaNeue/HelveticaNeueMedium.otf'),
    'HelveticaNeue-Light': require('./assets/fonts/helveticaNeue/HelveticaNeueMedium.otf'),
    'HelveticaNeue-Bold': require('./assets/fonts/helveticaNeue/HelveticaNeueBold.otf'),
    Bodoni: require('./assets/fonts/bodoni/bodoni.ttf'),
  });

  return (
    <ContextProvider>
      <KeyboardProvider>
        <SafeAreaProvider>
          <View style={{ flex: 1, backgroundColor: Colors.primaryDark }}>
            <StatusBar style="light" translucent />
            <Root />
            <KeyboardToolbar doneText="Završi unos" />
          </View>
        </SafeAreaProvider>
      </KeyboardProvider>
    </ContextProvider>
  );
}
