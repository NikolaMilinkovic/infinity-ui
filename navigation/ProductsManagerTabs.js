import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddItem from '../screens/ProductsManager/AddProduct/AddItem';
import EditItem from '../screens/ProductsManager/editProduct/EditItem';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function ProductsManagerTabs() {
  const colors = useThemeColors();
  /**
   * PRODUCTS MANAGER Tabs
   */
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
      <Tab.Screen
        name="AddItem"
        component={AddItem}
        options={{
          title: 'Dodaj Proizvod',
        }}
      />
      <Tab.Screen
        name="EditItem"
        component={EditItem}
        options={{
          title: 'Izmeni Proizvod',
        }}
      />
    </Tab.Navigator>
  );
}
