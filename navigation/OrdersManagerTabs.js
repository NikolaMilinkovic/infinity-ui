import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import BrowseOrders from '../screens/Orders/BrowseOrders';
import PackOrders from '../screens/Orders/PackOrders';
import BrowseReservations from '../screens/Reservations/BrowseReservations';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

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
      screenOptions={getTabScreenOptions(colors)}
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
