import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import BrowseProducts from '../screens/Home/browseProducts/BrowseProducts';
import NewOrder from '../screens/Home/newOrder/NewOrder';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function BrowsePageTabs() {
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
        name="BrowseProducts"
        component={BrowseProducts}
        options={{
          title: 'Lista Proizvoda',
        }}
      />
      <Tab.Screen
        name="NewOrder"
        component={NewOrder}
        options={{
          title: 'Nova Porudžbina',
        }}
      />
    </Tab.Navigator>
  );
}
