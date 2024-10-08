import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import ColorsManager from '../screens/ColorsManager/ColorsManager';
import CategoriesManager from '../screens/CategoriesManager/CategoriesManager';

const Tab = createMaterialTopTabNavigator();

export default function ColorsCategoriesTabs(){

  /**
   * BOJE i KATEGORIJE tabovi
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
        name="ColorsManager" 
        component={ColorsManager}
        options={{
          title: 'Boje',
        }}
      />
      <Tab.Screen 
        name="CategoriesManager" 
        component={CategoriesManager} 
        options={{
          title: 'Kategorije',
        }}/>
    </Tab.Navigator>
  )
}