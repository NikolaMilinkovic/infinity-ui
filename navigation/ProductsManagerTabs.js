import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import AddItem from '../screens/ProductsManager/AddProduct/AddItem';

const Tab = createMaterialTopTabNavigator();

export default function ProductsManagerTabs(){

  /**
   * PRODUCTS MANAGER Tabs
   */
  return (
    <Tab.Navigator screenOptions={{
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
      }
    }}>
      <Tab.Screen 
        name="AddItem" 
        component={AddItem}
        options={{
          title: 'Dodaj Proizvod',
        }}
      />
      {/* <Tab.Screen 
        name="AddItem" 
        component={} 
        options={{
          title: 'Izmeni Proizvod',
        }}/> */}
    </Tab.Navigator>
  )
}