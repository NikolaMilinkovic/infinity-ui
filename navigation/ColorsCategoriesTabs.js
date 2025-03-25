import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ColorsManager from '../screens/ColorsManager/ColorsManager';
import CategoriesManager from '../screens/CategoriesManager/CategoriesManager';
import SuppliersManager from '../screens/SuppliersManager/SuppliersManager';
import { useGetAppColors } from '../constants/useGetAppColors';

const Tab = createMaterialTopTabNavigator();

export default function ColorsCategoriesTabs(){
  const Colors = useGetAppColors();

  /**
   * BOJE, KATEGORIJE i DOBAVLJAČI tabovi
   */
  return (
    <Tab.Navigator screenOptions={{
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
      <Tab.Screen 
        name="SuppliersManager" 
        component={SuppliersManager} 
        options={{
          title: 'Dobavljači',
        }}/>
    </Tab.Navigator>
  )
}