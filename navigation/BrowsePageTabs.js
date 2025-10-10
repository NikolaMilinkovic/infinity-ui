import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import { useGetAppColors } from '../constants/useGetAppColors';
import BrowseProducts from '../screens/Home/browseProducts/BrowseProducts';
import NewOrder from '../screens/Home/newOrder/NewOrder';
import { useUser } from '../store/user-context';

const Tab = createMaterialTopTabNavigator();

export default function BrowsePageTabs() {
  const Colors = useGetAppColors();
  const user = useUser();

  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      screenOptions={{
        tabBarPressColor: Colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: Colors.primaryDark,
        },
        tabBarStyle: {
          backgroundColor: Colors.tabsBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.highlight,
          height: 3,
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
      {/* {user && user?.permissions?.orders?.create && ( */}
      <Tab.Screen
        name="NewOrder"
        component={NewOrder}
        options={{
          title: 'Nova Porudžbina',
        }}
      />
      {/* )} */}
    </Tab.Navigator>
  );
}
