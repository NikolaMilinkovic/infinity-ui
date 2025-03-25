import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import EndOfDay from '../screens/EndOfDay/EndOfDay';
import PreviousStatisticFiles from '../screens/EndOfDay/PreviousStatisticFiles';
import Versions from '../screens/Versions/Versions';

const Tab = createMaterialTopTabNavigator();

export default function AdminDashboardTabs(){

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
        name="Versions"
        component={Versions}
        options={{
          title: 'Versions',
        }}
      />
      <Tab.Screen 
        name="StatisticFiles" 
        component={PreviousStatisticFiles}
        options={{
          title: 'Prethodni Dani',
        }}
      />
    </Tab.Navigator>
  )
}