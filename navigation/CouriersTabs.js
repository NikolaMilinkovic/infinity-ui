import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CouriersManager from '../screens/CouriersManager/CouriersManager';
import SuppliersManager from '../screens/SuppliersManager/SuppliersManager';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function CouriersTabs() {
  const colors = useThemeColors();
  /**
   * COURIERS tabovi
   */
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: colors.secondaryDark,
        },
        tabBarStyle: {
          backgroundColor: colors.secondaryLight,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.highlight,
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
