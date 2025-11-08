import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import ProductsListModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/ProductsListModalComponent';
import SelectedItemsModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/SelectedItemsModalComponent';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();
export default function NewArticleTabs({ setNewProducts, newProducts }) {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
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
          height: 4,
        },
        lazy: false,
        tabBarBounces: true,
        swipeEnabled: true,
      }}
    >
      {/* NEW ARTICLE PICKER */}
      <Tab.Screen
        name="NewArticlePicker"
        options={{
          title: 'Izaberi nove artikle',
        }}
      >
        {() => <ProductsListModalComponent newProducts={newProducts} setNewProducts={setNewProducts} />}
      </Tab.Screen>

      {/* COLOR | SIZE PICKER */}
      <Tab.Screen
        name="NewArticleColorSizePicker"
        options={{
          title: 'Boje i Veličine',
        }}
      >
        {() => <SelectedItemsModalComponent selectedItems={newProducts} setSelectedItems={setNewProducts} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
