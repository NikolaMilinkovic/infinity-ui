import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PreviousStatisticFiles from '../screens/EndOfDay/PreviousStatisticFiles';
import Versions from '../screens/Versions/Versions';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function AdminDashboardTabs() {
  const colors = useThemeColors();
  /**
   * END OF DAY tabs
   */
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
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
  );
}
