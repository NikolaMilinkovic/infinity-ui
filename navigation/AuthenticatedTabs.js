import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BrowseProducts from '../screens/Home/BrowseProducts';
import AddItem from '../screens/Home/AddItem';
import NewOrder from '../screens/Home/NewOrder';
import { Colors } from '../constants/colors';
import { Dimensions } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function AuthenticatedTabs(){
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
        }}
      />
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