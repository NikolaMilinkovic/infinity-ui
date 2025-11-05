import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddUser from '../components/userManager/AddUser';
import EditUser from '../components/userManager/EditUser';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function UserManagerTabs() {
  const colors = useThemeColors();
  /**
   * COURIERS tabovi
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
  );
}
