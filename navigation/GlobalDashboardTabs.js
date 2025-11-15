import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BoutiquesManager from '../screens/GlobalDashboard/BoutiquesManager';
import { DrawerModalProvider } from '../store/modals/drawer-modal-contex';
import { BoutiquesProvider } from '../store/superAdmin/boutiques-context';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function GlobalDashboardTabs() {
  const colors = useThemeColors();
  /**
   * END OF DAY tabs
   */
  function getBoutiqesManager() {
    return (
      <BoutiquesProvider>
        <DrawerModalProvider>
          <BoutiquesManager />
        </DrawerModalProvider>
      </BoutiquesProvider>
    );
  }
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
      {/* BOUTIQUES MANAGER */}
      <Tab.Screen
        name="BoutiquesManager"
        component={getBoutiqesManager}
        options={{
          title: 'Boutiques Manager',
        }}
      />
    </Tab.Navigator>
  );
}
