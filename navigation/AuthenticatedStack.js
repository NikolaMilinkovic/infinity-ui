import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { CustomDrawerContent } from './DrawerNavigation';
import AuthenticatedTabs from './AuthenticatedTabs';
import { Colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import UserManager from '../screens/UserManager/UserManager';
import Settings from '../screens/Settings/Settings';
import Profile from '../screens/Profile/Profile';
import ColorsCategoriesTabs from './ColorsCategoriesTabs';
import ProductsManagerTabs from './ProductsManagerTabs';
import CouriersTabs from './CouriersTabs';


const Drawer = createDrawerNavigator();

export default function AuthenticatedStack() {
  const navigation = useNavigation();

  function logoOnPressNavigator(){
    navigation.navigate('BrowseProducts')
  }

  const drawerScreenOptions = {
    title: '',
    headerTitle: () => (
      <View style={styles.headerTitleContainer}>
        <Pressable 
          onPress={logoOnPressNavigator} 
          style={({ pressed }) => [pressed && styles.pressed, {marginBottom: 10}]}
        >
          <Image 
            source={require('../assets/infinity-white.png')}
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
      width: '80%',
    },
    headerStyle: {
      backgroundColor: Colors.primaryDark,
    },
    drawerActiveTintColor: Colors.defaultText,
    drawerInactiveTintColor: Colors.defaultText
  }

  /**
   * Postavlja stranice tako da kada kliknemo na dugme u DrawerNavigation
   * One usmeravaju ka jednoj od ovih stranica
   * Uzima CustomDrawerContent > To su dugmici unutar ove DrawerNavigation.js
   */
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={drawerScreenOptions}
    >
      {/* Profile Settings UserManager */}
      {/* HOME SCREEN / LANDING SCREEN WITH TAB NAVIGATION */}
      <Drawer.Screen 
        name="Home" 
        component={AuthenticatedTabs} 
      />

      {/* PROFILE */}
      <Drawer.Screen 
        name="Profile" 
        component={Profile} 
      />

      {/* SETTINGS */}
      <Drawer.Screen 
        name="Settings" 
        component={Settings} 
      />

      {/* USERMANAGER */}
      <Drawer.Screen 
        name="UserManager" 
        component={UserManager} 
      />

      {/* COLORS AND CATEGORIES TAB SCREEN */}
      <Drawer.Screen
        name="ColorsCategoriesTabs"
        component={ColorsCategoriesTabs}
        options={{ drawerLabel: 'Boje i Kategorije' }}
      />

      {/* COURIERS TAB SCREEN */}
      <Drawer.Screen
        name="CouriersTabs"
        component={CouriersTabs}
        options={{ drawerLabel: 'Kuriri' }}
      />

      {/* PRODUCTS MANAGER */}
      <Drawer.Screen
        name="ProductsManager"
        component={ProductsManagerTabs}
        options={{ drawerLabel: 'Upravljanje Proizvodima' }}
      />
    </Drawer.Navigator>
  );
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
    pressed: {
      opacity: 0.7
    }
  });

  