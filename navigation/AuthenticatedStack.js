import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useAuthContext } from '../hooks/useAuthContext';
import Profile from '../screens/Profile/Profile';
import { useBoutique } from '../store/app-context';
import EndOfDayStatisticsContextProvider from '../store/end-of-day-statistics';
import { useThemeColors } from '../store/theme-context';
import { initializeAuthContext } from '../util-methods/FetchMethods';
import AdminDashboardTabs from './AdminDashboardTabs';
import BrowsePageTabs from './BrowsePageTabs';
import ColorsCategoriesTabs from './ColorsCategoriesTabs';
import CouriersTabs from './CouriersTabs';
import { CustomDrawerContent } from './DrawerNavigation';
import EndOfDayTabs from './EndOfDayTabs';
import GlobalDashboardTabs from './GlobalDashboardTabs';
import OrdersManagerTabs from './OrdersManagerTabs';
import ProductsManagerTabs from './ProductsManagerTabs';
import SettingsTabs from './SettingsTabs';
import UserManagerTabs from './userManagerTabs';

const Drawer = createDrawerNavigator();

export default function AuthenticatedStack() {
  const drawerRef = useRef();
  const navigation = useNavigation();
  const authCtx = useAuthContext();
  const boutique = useBoutique();
  const colors = useThemeColors();

  useEffect(() => {
    initializeAuthContext(authCtx);
  }, [authCtx]);

  function logoOnPressNavigator() {
    navigation.navigate('Home', { screen: 'BrowseProducts' });
    drawerRef.current?.setActive('Home');
  }

  const drawerScreenOptions = {
    title: '',
    headerTitle: () => (
      <View style={styles.headerTitleContainer}>
        {boutique?.data.settings?.appIcon?.appIconUri && (
          <Pressable
            onPress={logoOnPressNavigator}
            style={({ pressed }) => [pressed && styles.pressed, { marginBottom: 10 }]}
          >
            <Image
              source={{ uri: boutique?.data.settings?.appIcon?.appIconUri }}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    ),
    headerTitleAlign: 'center',
    headerTintColor: colors.navText,
    drawerStyle: {
      backgroundColor: colors.primaryLight,
      width: '80%',
    },
    headerStyle: {
      backgroundColor: colors.navBackground,
      height: 100,
    },
    drawerActiveTintColor: colors.defaultText,
    drawerInactiveTintColor: colors.defaultText,
    tabBarPressColor: colors.tabsPressEffect,
  };

  /**
   * Postavlja stranice tako da kada kliknemo na dugme u DrawerNavigation
   * One usmeravaju ka jednoj od ovih stranica
   * Uzima CustomDrawerContent > To su dugmici unutar ove DrawerNavigation.js
   * Ovde se stavljaju Tabovi
   */
  return (
    // <></>
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent ref={drawerRef} {...props} />}
      screenOptions={drawerScreenOptions}
    >
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
      <Drawer.Screen name="AdminDashboardTabs" component={AdminDashboardTabs} />

      {/* GLOBAL DASHBOARD */}
      <Drawer.Screen name="GlobalDashboardTabs" component={GlobalDashboardTabs} />

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

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  headerImage: {
    width: 150,
    height: 40,
  },
  pressed: {
    opacity: 0.7,
  },
});
