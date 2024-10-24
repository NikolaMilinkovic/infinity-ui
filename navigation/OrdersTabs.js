import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BrowseProducts from '../screens/Home/browseProducts/BrowseProducts';
import NewOrder from '../screens/Home/newOrder/NewOrder';
import { Colors } from '../constants/colors';
import { Dimensions } from 'react-native';
import BrowseOrders from '../screens/Orders/BrowseOrders';

const Tab = createMaterialTopTabNavigator();

export default function OrdersTabs(){
  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator 
      initialLayout={{
        width: Dimensions.get('window').width
      }}
      screenOptions={{  
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
        },
        lazy: false,
        tabBarBounces: true,
        swipeEnabled: true,
    }}>
      <Tab.Screen 
        name="BrowseOrders" 
        component={BrowseOrders}
        options={{
          title: 'Lista porudžbina',
        }}
      />
      {/* <Tab.Screen 
        name="NewOrder" 
        component={NewOrder} 
        options={{
          title: 'Nova Porudzbina',
        }}
      /> */}
    </Tab.Navigator>
  )
}