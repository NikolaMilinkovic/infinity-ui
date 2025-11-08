import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import BrowseProducts from '../screens/Home/browseProducts/BrowseProducts';
import NewOrder from '../screens/Home/newOrder/NewOrder';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function BrowsePageTabs() {
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
          color: colors.primaryDark,
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
        name="BrowseProducts"
        component={BrowseProducts}
        options={{
          title: 'Lista Proizvoda',
        }}
      />
      <Tab.Screen
        name="NewOrder"
        component={NewOrder}
        options={{
          title: 'Nova Porudžbina',
        }}
      />
    </Tab.Navigator>
  );
}
