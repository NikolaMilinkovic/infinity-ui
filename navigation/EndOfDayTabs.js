import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EndOfDay from '../screens/EndOfDay/EndOfDay';
import PreviousStatisticFiles from '../screens/EndOfDay/PreviousStatisticFiles';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function EndOfDayTabs() {
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
          color: colors.primaryDark,
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
      <Tab.Screen
        name="EndOfDayScreen"
        component={EndOfDay}
        options={{
          title: 'Izvuci Porudžbine',
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
