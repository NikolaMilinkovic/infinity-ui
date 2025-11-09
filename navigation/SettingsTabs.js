import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import GlobalAppSettings from '../screens/Settings/GlobalAppSettings';
import UserSettings from '../screens/Settings/UserSettings';
import { useThemeColors } from '../store/theme-context';
import { useUser } from '../store/user-context';

const Tab = createMaterialTopTabNavigator();

export default function SettingsTabs() {
  const { user } = useUser();
  const colors = useThemeColors();

  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
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
          height: 4,
        },
        lazy: false,
        tabBarBounces: true,
        swipeEnabled: true,
      }}
    >
      <Tab.Screen
        name="userSettings"
        component={UserSettings}
        options={{
          title: 'Podešavanja aplikacije',
        }}
      />
      {user && user?.role === 'admin' && (
        <Tab.Screen
          name="globalSettings"
          component={GlobalAppSettings}
          options={{
            title: 'Globalna podešavanja',
          }}
        />
      )}
    </Tab.Navigator>
  );
}
