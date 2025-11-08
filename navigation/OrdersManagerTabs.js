import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import BrowseOrders from '../screens/Orders/BrowseOrders';
import PackOrders from '../screens/Orders/PackOrders';
import BrowseReservations from '../screens/Reservations/BrowseReservations';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function OrdersManagerTabs() {
  const colors = useThemeColors();
  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      screenOptions={{
        tabBarPressColor: colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: colors.secondaryDark,
        },
        tabBarStyle: {
          backgroundColor: colors.tabsBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.highlight,
          height: 4,
        },
        lazy: false,
        tabBarBounces: true,
        swipeEnabled: true,
      }}
    >
      <Tab.Screen
        name="BrowseOrders"
        component={BrowseOrders}
        options={{
          title: 'Porudžbine',
        }}
      />
      <Tab.Screen
        name="BrowseReservations"
        component={BrowseReservations}
        options={{
          title: 'Rezervacije',
        }}
      />
      <Tab.Screen
        name="PackOrders"
        component={PackOrders}
        options={{
          title: 'Pakovanje',
        }}
      />
    </Tab.Navigator>
  );
}
