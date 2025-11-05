import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BoutiquesManager from '../screens/GlobalDashboard/BoutiquesManager';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function GlobalDashboardTabs() {
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
          backgroundColor: colors.tabsBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.highlight,
          height: 3,
        },
      }}
    >
      {/* BOUTIQUES MANAGER */}
      <Tab.Screen
        name="BoutiquesManager"
        component={BoutiquesManager}
        options={{
          title: 'Boutiques Manager',
        }}
      />
    </Tab.Navigator>
  );
}
