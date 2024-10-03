import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './screens/auth/Login';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from './store/auth-context';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import AddItem from './screens/AddItem';
import BrowseProducts from './screens/BrowseProducts';
import NewOrder from './screens/NewOrder';
import { Ionicons } from '@expo/vector-icons';
import NavigationButton from './util-components/NavigationButton';
import { Colors } from './constants/colors';
import ContextProvider from './store/ContextProvider';
import { ColorsContext } from './store/colors-context';
import { PopupMessagesComponent } from './util-components/PopupMessage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import Temp from './screens/Temp';



const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
  );
}
function AuthenticatedTabs(){
  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { 
        fontSize: 11,
        color: Colors.secondaryDark
      },
      tabBarStyle: { 
        backgroundColor: Colors.secondaryLight,
        
      },
      tabBarIndicatorStyle: {
        backgroundColor: Colors.highlight,
        height: 3, 
      }
    }}>
      <Tab.Screen 
        name="BrowseProducts" 
        component={BrowseProducts}
        options={{
          title: 'Lista Proizvoda',
        }}
      />
      <Tab.Screen 
        name="AddItem" 
        component={AddItem} 
        options={{
          title: 'Dodaj Proizvod',
        }}/>
      <Tab.Screen 
        name="NewOrder" 
        component={NewOrder} 
        options={{
          title: 'Nova Porudzbina',
        }}
      />
    </Tab.Navigator>
  )
}

/**
 * Handles display of icons / screens in the drawer menu
 */
function CustomDrawerContent(props) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  function navigatePages(pageName:string){
    navigation.navigate(pageName)
  }
  function temp(){
    navigation.navigate('Temp');
  }

  return (
    <View style={{ flex: 1, paddingBottom: 60, paddingTop: 60 }}>
      <NavigationButton 
        icon="home" 
        onPress={() => navigatePages('Home')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Početna'
      />
      <NavigationButton 
        icon="user" 
        onPress={() => navigatePages('Profile')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Profile'
      />
      <NavigationButton 
        icon="setting" 
        onPress={() => navigatePages('Settings')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Settings'
      />
      <NavigationButton 
        icon="profile" 
        onPress={() => navigatePages('UserManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='User Manager'
      />
      <NavigationButton 
        icon="color-palette-outline" 
        onPress={() => navigatePages('ColorsManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Boje'
        type='Ionicon'
      />

      {/* Bottom Buttons */}
      <View style={{
        marginTop: 'auto'
      }}>
        <NavigationButton 
          icon="logout" 
          onPress={authCtx.logout} 
          size={18} 
          color={Colors.error}
          text='Logout'
        />
      </View>
    </View>
  );
}
function AuthenticatedStack() {
  const navigation = useNavigation();

  function navigateToProductsList(){
    navigation.navigate('BrowseProducts')
  }

  // Navbar Logo Styles
  const styles = StyleSheet.create({
    headerTitleContainer: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 60,
    },
    headerImage: {
      width: 150,
      height: 45,
    },
  });

  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={{
        title: '',
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Pressable onPress={navigateToProductsList}>
              <Image 
                source={require('./assets/infinity-white.png')}
                style={styles.headerImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        ),
        headerTitleAlign: 'center',
        headerTintColor: Colors.whiteText,
        drawerStyle: {
          backgroundColor: Colors.primaryLight,
          width: '60%',
        },
        headerStyle: {
          backgroundColor: Colors.primaryDark,
        },
        drawerActiveTintColor: Colors.defaultText,
        drawerInactiveTintColor: Colors.defaultText
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={AuthenticatedTabs} 
        options={{
          drawerIcon: () => (
            <Ionicons name="home" size={22} color='white' />
          ),
        }}
      />
      <Drawer.Screen 
        name="ColorsManager"
        component={Temp}
        options={{
          drawerIcon: () => (
            <Ionicons name="color-palette-outline" size={22} color='white' />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * Handles different Navigation Stack based on isAuthenticated flag in the context
 * Itterates between AuthStack & AuthenticatedStack
 */
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
  /**
   * Makes the native splash screen remain visible until hideAsync is called.
   */
  SplashScreen.preventAutoHideAsync();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const authCtx = useContext(AuthContext);

  /**
   * Checks the token in the AsyncStorage upon app startup
   * Finds token => Adds it to the Auth Context
   * No token => Logout user
   */
  useEffect(() => {
    async function getToken(){
      const token = await AsyncStorage.getItem('token');
      if(token){
        authCtx.authenticate(token);
      } else {
        authCtx.logout();
      }

      setIsCheckingToken(false);
    }

    getToken();
  }, [authCtx])

  /**
   * Hide spash screen on app load
   */
  const onLayoutRootView = useCallback(async() => {
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
      <PopupMessagesComponent/>
      <Navigation />
    </View>
  )
}
export default function App() {
  const networkStatus = useNetworkStatus();

  return (
    <>
      <StatusBar style="light" />
      <ContextProvider>
          <Root/>
      </ContextProvider>
    </>
  );
}


