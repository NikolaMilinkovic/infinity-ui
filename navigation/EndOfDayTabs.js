import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import CouriersManager from '../screens/CouriersManager/CouriersManager';
import EndOfDay from '../screens/EndOfDay/EndOfDay';

const Tab = createMaterialTopTabNavigator();

export default function EndOfDayTabs(){

  /**
   * END OF DAY tabs
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
        name="EndOfDayScreen" 
        component={EndOfDay}
        options={{
          title: 'Izvuci Porudžbine',
        }}
      />
      <Tab.Screen 
        name="StatisticFiles" 
        component={EndOfDay}
        options={{
          title: 'Prethodni Dani',
        }}
      />
    </Tab.Navigator>
  )
}