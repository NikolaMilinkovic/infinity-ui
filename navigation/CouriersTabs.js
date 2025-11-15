import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CouriersManager from '../screens/CouriersManager/CouriersManager';
import SuppliersManager from '../screens/SuppliersManager/SuppliersManager';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function CouriersTabs() {
  const colors = useThemeColors();
  /**
   * COURIERS tabovi
   */
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
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
