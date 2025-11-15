import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import GlobalAppSettings from '../screens/Settings/GlobalAppSettings';
import UserSettings from '../screens/Settings/UserSettings';
import { useThemeColors } from '../store/theme-context';
import { useUser } from '../store/user-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function SettingsTabs() {
  const { user, getUserValueForField } = useUser();
  const colors = useThemeColors();

  /**
   * Main TAB navigation | The sliding windows
   */
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      screenOptions={getTabScreenOptions(colors)}
    >
      <Tab.Screen
        name="userSettings"
        component={UserSettings}
        options={{
          title: 'Podešavanja aplikacije',
        }}
      />
      {getUserValueForField('role') === 'admin' && (
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
