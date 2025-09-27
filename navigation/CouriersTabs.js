import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../constants/colors';
import CouriersManager from '../screens/CouriersManager/CouriersManager';
import SuppliersManager from '../screens/SuppliersManager/SuppliersManager';

const Tab = createMaterialTopTabNavigator();

export default function CouriersTabs() {
  /**
   * COURIERS tabovi
   */
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: Colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: Colors.secondaryDark,
        },
        tabBarStyle: {
          backgroundColor: Colors.secondaryLight,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.highlight,
          height: 3,
        },
      }}
    >
      <Tab.Screen
        name="CouriersManager"
        component={CouriersManager}
        options={{
          title: 'Kuriri',
        }}
      />
      <Tab.Screen
        name="SuppliersManager"
        component={SuppliersManager}
        options={{
          title: 'Dobavljači',
        }}
      />
    </Tab.Navigator>
  );
}
