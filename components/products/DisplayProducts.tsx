import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './display_product/DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';
import { serachProducts } from '../../util-methods/ProductFilterMethods';
import { SearchParamsTypes } from '../../types/allTsTypes';

function DisplayProducts() {
  const productsCtx = useContext(AllProductsContext);
  const [searchData, setSearchData] = useState('');

  // =============================[ SEARCH INPUT STUFF ]=============================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    isOnStock: false,
    isNotOnStock: false,
    onStockAndSoldOut: false,
    onCategorySearch: '',
    onColorsSearch: [],
    onSizeSearch: [],
  });
  
  // Handle radio button changes directly through searchParams
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  // ============================[ \SEARCH INPUT STUFF\ ]============================

  // Memoize the filtered products
  const filteredData = useMemo(() => {
    return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
  }, [productsCtx.allActiveProducts, searchData, searchParams]);

  return (
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
          data={filteredData}
          renderItem={({ item }) => <DisplayProduct item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productsContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  productsContainer: {
    flexGrow: 1,
  },
})

export default DisplayProducts