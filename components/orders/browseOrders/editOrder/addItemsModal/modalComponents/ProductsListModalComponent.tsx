import { FlatList, StyleSheet, Text, View } from "react-native";
import DisplayProductModalComponent from "./DisplayProductModalComponent";
import { useContext, useMemo } from "react";
import { AllProductsContext } from "../../../../../../store/all-products-context";

// DISPLAYS A LIST OF PRODUCTS
export default function ProductsListModalComponent({ newProducts, setNewProducts }: any){
  const productsCtx = useContext(AllProductsContext);
  const filteredData = useMemo(() => {
    return productsCtx.allActiveProducts
  },[productsCtx.allActiveProducts]);

  // Adds new product to newProducts array, this array holds all the products that we
  // want to add the the order, next step is to pick color / size for the item
  function addNewProduct(item: any){
    setNewProducts((prev: any) => [...prev, item])
  }

  return(
    <View style={styles.container}>
      {filteredData && filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => 
            <DisplayProductModalComponent
              addNewProduct={addNewProduct}
              item={item} 
            />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  }
})