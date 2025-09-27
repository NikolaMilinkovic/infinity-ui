import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import { useGetAppColors } from '../constants/useGetAppColors';
import GlobalAppSettings from '../screens/Settings/GlobalAppSettings';
import UserSettings from '../screens/Settings/UserSettings';
import { useUser } from '../store/user-context';

const Tab = createMaterialTopTabNavigator();

export default function SettingsTabs() {
  const Colors = useGetAppColors();
  const user = useUser();
  const role = user.getUserRole();

  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      screenOptions={{
        tabBarPressColor: Colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: Colors.primaryDark,
        },
        tabBarStyle: {
          backgroundColor: Colors.tabsBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.highlight,
          height: 3,
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
      {user && role === 'admin' && (
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
