import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PreviousStatisticFiles from '../screens/EndOfDay/PreviousStatisticFiles';
import Versions from '../screens/Versions/Versions';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function AdminDashboardTabs() {
  const colors = useThemeColors();
  /**
   * END OF DAY tabs
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
          height: 4,
        },
      }}
    >
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
