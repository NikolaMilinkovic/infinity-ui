import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import ColorsManager from '../screens/ColorsManager/ColorsManager';
import CategoriesManager from '../screens/CategoriesManager/CategoriesManager';
import CouriersManager from '../screens/CouriersManager/CouriersManager';

const Tab = createMaterialTopTabNavigator();

export default function ColorsCategoriesTabs(){

  /**
   * COURIERS tabovi
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
        name="CouriersManager" 
        component={CouriersManager}
        options={{
          title: 'Kuriri',
        }}
      />
    </Tab.Navigator>
  )
}