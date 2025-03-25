import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BrowseProducts from '../screens/Home/browseProducts/BrowseProducts';
import AddItem from '../screens/ProductsManager/AddProduct/AddItem';
import NewOrder from '../screens/Home/newOrder/NewOrder';
import { Colors } from '../constants/colors';
import { Dimensions } from 'react-native';
import { useGetAppColors } from '../constants/useGetAppColors';

const Tab = createMaterialTopTabNavigator();

export default function BrowsePageTabs(){
  const Colors = useGetAppColors();
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
          color: Colors.primaryDark
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
    }}>
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
  )
}