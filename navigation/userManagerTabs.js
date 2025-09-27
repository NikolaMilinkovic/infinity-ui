import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddUser from '../components/userManager/AddUser';
import EditUser from '../components/userManager/EditUser';
import { Colors } from '../constants/colors';

const Tab = createMaterialTopTabNavigator();

export default function UserManagerTabs() {
  /**
   * COURIERS tabovi
   */
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: Colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: Colors.secondaryDark,
        },
        tabBarStyle: {
          backgroundColor: Colors.secondaryLight,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.highlight,
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
