import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import ProductsListModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/ProductsListModalComponent';
import SelectedItemsModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/SelectedItemsModalComponent';
import { Colors } from '../constants/colors';

const Tab = createMaterialTopTabNavigator();
export default function NewArticleTabs({ setNewProducts, newProducts }) {
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
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
