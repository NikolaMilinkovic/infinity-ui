import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddUser from '../components/userManager/AddUser';
import EditUser from '../components/userManager/EditUser';
import { useThemeColors } from '../store/theme-context';
import UsersManagerProvider from '../store/users-manager-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function UserManagerTabs() {
  const colors = useThemeColors();
  /**
   * COURIERS tabovi
   */
  return (
    <UsersManagerProvider>
      <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
        <Tab.Screen
          name="EditUser"
          component={EditUser}
          options={{
            title: 'Lista korisnika',
          }}
        />
        <Tab.Screen
          name="AddUser"
          component={AddUser}
          options={{
            title: 'Kreiranje korisnika',
          }}
        />
      </Tab.Navigator>
    </UsersManagerProvider>
  );
}
