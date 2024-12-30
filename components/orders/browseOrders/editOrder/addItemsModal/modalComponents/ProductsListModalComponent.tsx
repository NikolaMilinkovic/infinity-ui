import { FlatList, StyleSheet, Text, View } from "react-native";
import DisplayProductModalComponent from "./DisplayProductModalComponent";
import { useContext, useMemo, useState } from "react";
import { AllProductsContext } from "../../../../../../store/all-products-context";
import SearchProducts from "../../../../../products/SearchProducts";
import { SearchParamsTypes } from "../../../../../../types/allTsTypes";
import { serachProducts } from "../../../../../../util-methods/ProductFilterMethods";

// DISPLAYS A LIST OF PRODUCTS
export default function ProductsListModalComponent({ newProducts, setNewProducts }: any){
  const productsCtx = useContext(AllProductsContext);

  // Adds new product to newProducts array, this array holds all the products that we
  // want to add the the order, next step is to pick color / size for the item
  function addNewProduct(item: any){
    setNewProducts((prev: any) => [...prev, item])
  }

    // =============================[ SEARCH INPUT STUFF ]=============================
    const [searchData, setSearchData] = useState('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
      isOnStock: false,
      isNotOnStock: false,
      onStockAndSoldOut: false,
      onCategorySearch: '',
      onSupplierSearch: '',
      onColorsSearch: [],
      onSizeSearch: [],
      active: true,
      inactive: false,
    });
  
    // Handle radio button changes directly through searchParams
    function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [paramName]: value,
      }));
    }
  
    const filteredData = useMemo(() => {
      return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
    },[productsCtx.allActiveProducts, searchData, searchParams]);
    // ============================[ \SEARCH INPUT STUFF\ ]============================

  return(
    <View style={styles.container}>
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        updateSearchParam={updateSearchParam}
      />
      {filteredData && filteredData.length > 0 && (
        <FlatList
          style={styles.list}
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
  },
  list: {
    marginBottom: 85,
  }
})