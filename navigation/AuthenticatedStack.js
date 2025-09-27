import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { CustomDrawerContent } from './DrawerNavigation';
// import { Colors } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useGetAppColors } from '../constants/useGetAppColors';
import { useAuthContext } from '../hooks/useAuthContext';
import Profile from '../screens/Profile/Profile';
import { useGetAppContexts } from '../store/app-context';
import EndOfDayStatisticsContextProvider from '../store/end-of-day-statistics';
import { initializeAuthContext } from '../util-methods/FetchMethods';
import AdminDashboardTabs from './AdminDashboardTabs';
import BrowsePageTabs from './BrowsePageTabs';
import ColorsCategoriesTabs from './ColorsCategoriesTabs';
import CouriersTabs from './CouriersTabs';
import EndOfDayTabs from './EndOfDayTabs';
import OrdersManagerTabs from './OrdersManagerTabs';
import ProductsManagerTabs from './ProductsManagerTabs';
import SettingsTabs from './SettingsTabs';
import UserManagerTabs from './userManagerTabs';

const Drawer = createDrawerNavigator();

export default function AuthenticatedStack() {
  const navigation = useNavigation();
  const authCtx = useAuthContext();
  const appCtx = useGetAppContexts();
  const Colors = useGetAppColors();
  useEffect(() => {
    initializeAuthContext(authCtx);
  }, [authCtx]);

  function logoOnPressNavigator() {
    navigation.navigate('BrowseProducts');
  }

  const drawerScreenOptions = {
    title: '',
    headerTitle: () => (
      <View style={styles.headerTitleContainer}>
        <Pressable
          onPress={logoOnPressNavigator}
          style={({ pressed }) => [pressed && styles.pressed, { marginBottom: 10 }]}
        >
          {/* <Image source={require('../assets/infinity-white.png')} style={styles.headerImage} resizeMode="contain" /> */}
          <Image
            source={{ uri: appCtx?.appSettings?.appIcon?.appIconUri }}
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
    drawerInactiveTintColor: Colors.defaultText,
    tabBarPressColor: Colors.tabsPressEffect,
  };

  /**
   * Postavlja stranice tako da kada kliknemo na dugme u DrawerNavigation
   * One usmeravaju ka jednoj od ovih stranica
   * Uzima CustomDrawerContent > To su dugmici unutar ove DrawerNavigation.js
   * Ovde se stavljaju Tabovi
   */
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={drawerScreenOptions}>
      {/* Profile Settings UserManager */}
      {/* HOME SCREEN / LANDING SCREEN WITH TAB NAVIGATION */}
      <Drawer.Screen name="Home" component={BrowsePageTabs} />

      {/* ORDERS */}
      <Drawer.Screen name="Orders" component={OrdersManagerTabs} />

      {/* PROFILE */}
      <Drawer.Screen name="Profile" component={Profile} />

      {/* SETTINGS */}
      <Drawer.Screen name="SettingsTabs" component={SettingsTabs} />

      {/* END OF DAY */}
      <Drawer.Screen name="EndOfDayTabs">
        {(props) => (
          <EndOfDayStatisticsContextProvider>
            <EndOfDayTabs {...props} />
          </EndOfDayStatisticsContextProvider>
        )}
      </Drawer.Screen>

      {/* ADMIN DASHBOARD */}
      {/* {authCtx.} */}
      <Drawer.Screen name="AdminDashboardTabs" component={AdminDashboardTabs} />

      {/* USERMANAGER */}
      <Drawer.Screen name="UserManagerTabs" component={UserManagerTabs} />

      {/* COLORS AND CATEGORIES TAB SCREEN */}
      <Drawer.Screen
        name="ColorsCategoriesTabs"
        component={ColorsCategoriesTabs}
        options={{ drawerLabel: 'Boje, Kategorije i Dobavljači' }}
      />

      {/* COURIERS TAB SCREEN */}
      <Drawer.Screen name="CouriersTabs" component={CouriersTabs} options={{ drawerLabel: 'Kuriri' }} />

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
// function getStyles(Colors: AppColors){
//   return
// }
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
    opacity: 0.7,
  },
});
