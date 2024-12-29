import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../constants/colors";
import ProductsListModalComponent from "../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/ProductsListModalComponent";
import BrowseProducts from "../screens/Home/browseProducts/BrowseProducts";
import { Dimensions, Text } from "react-native";
import SelectedItemsModalComponent from "../components/orders/browseOrders/editOrder/addItemsModal/modalComponents/SelectedItemsModalComponent";
import SearchProducts from "../components/products/SearchProducts";


const Tab = createMaterialTopTabNavigator();
export default function NewArticleTabs({ setNewProducts, newProducts }){

  return(
    <Tab.Navigator 
      initialLayout={{
        width: Dimensions.get('window').width
      }}
      screenOptions={{  
        tabBarLabelStyle: { 
          fontSize: 11,
          color: Colors.secondaryDark
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
      }}>

        {/* NEW ARTICLE PICKER */}
        <Tab.Screen 
          name="NewArticlePicker" 
          options={{
            title: 'Izaberi nove artikle',
          }}
        >
          {() =>
            <ProductsListModalComponent
              newProducts={newProducts}
              setNewProducts={setNewProducts}  
            />
          }
        </Tab.Screen>

        {/* COLOR | SIZE PICKER */}
        <Tab.Screen 
          name="NewArticleColorSizePicker" 
          options={{
            title: 'Boje i Veličine',
          }}
        >
          {() =>
            <SelectedItemsModalComponent
              selectedItems={newProducts}
              setSelectedItems={setNewProducts}
            />
          }
        </Tab.Screen>
    </Tab.Navigator>
  )
}