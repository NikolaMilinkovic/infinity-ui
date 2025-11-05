import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddItem from '../screens/ProductsManager/AddProduct/AddItem';
import EditItem from '../screens/ProductsManager/editProduct/EditItem';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function ProductsManagerTabs() {
  const colors = useThemeColors();
  /**
   * PRODUCTS MANAGER Tabs
   */
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: colors.secondaryDark,
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
