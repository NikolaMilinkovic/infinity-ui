import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EndOfDay from '../screens/EndOfDay/EndOfDay';
import PreviousStatisticFiles from '../screens/EndOfDay/PreviousStatisticFiles';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function EndOfDayTabs() {
  const colors = useThemeColors();
  /**
   * END OF DAY tabs
   */
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
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
