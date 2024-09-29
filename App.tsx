import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './screens/auth/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Temp from './screens/Temp';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './store/auth-context';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import AuthContextProvider from './store/auth-context';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function AuthStack() {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
  );
}

function AuthenticatedStack(){
  const authCtx = useContext(AuthContext)
  return (
    <Tab.Navigator>
      <Tab.Screen name="temp" component={Temp} />
    </Tab.Navigator>
  )
}

function Navigation(){
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack/>}
      {authCtx.isAuthenticated && <AuthenticatedStack/>}
    </NavigationContainer>
  )
}

function Root(){
  SplashScreen.preventAutoHideAsync();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function getToken(){
      const token = await AsyncStorage.getItem('token');
      if(token){
        authCtx.authenticate(token);
      }

      setIsCheckingToken(false);
    }

    getToken();
  }, [authCtx])

  const onLayoutRootView = useCallback( async() => {
    if(!isCheckingToken){
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isCheckingToken]);

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <Root/>
      </AuthContextProvider>
    </>
  );
}


