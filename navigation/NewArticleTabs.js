import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import ProductsListModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/ProductsListModalComponent';
import SelectedItemsModalComponent from '../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/SelectedItemsModalComponent';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();
export default function NewArticleTabs({ setNewProducts, newProducts }) {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      screenOptions={getTabScreenOptions(colors)}
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
