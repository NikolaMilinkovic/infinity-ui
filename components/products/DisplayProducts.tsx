import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { DressesContext } from '../../store/dresses-context';
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';
import { serachProducts } from '../../util-methods/ProductFilterMethods';
import { betterConsoleLog } from '../../util-methods/LogMethods';

interface ColorSizeType {
  size: string;
  stock: number;
  _id: string;
}
interface DressColorType {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeType[];
}
interface DressType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: DressColorType[];
}
interface PurseColorType {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;
}
interface PurseType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: PurseColorType[];
}
type ProductType = DressType | PurseType;

function DisplayProducts() {
  const dressesCtx = useContext(DressesContext);
  const productsCtx = useContext(AllProductsContext);
  const [searchData, setSearchData] = useState('');
  const [searchColors, setSearchColors] = useState([]);

  // =============================[ SEARCH INPUT STUFF ]=============================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  function handleOutsideClick(){
    setIsExpanded(false)
  }

  // Search Params object
  const [searchParams, setSearchParams] = useState({
    isOnStock: false,
    isNotOnStock: false,
    onStockAndSoldOut: false,
    onColorsSearch: [],
    onSizeSearch: [],
  });
  
  // Handle radio button changes directly through searchParams
  function updateSearchParam(paramName: string, value: boolean) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  useEffect(() => {
    betterConsoleLog('> SEARCH PARAMS ARE', searchParams);
  }, [searchParams])
  // ============================[ \SEARCH INPUT STUFF\ ]============================

  // =============================[ FILTER METHODS ]=============================

  // ============================[ \FILTER METHODS\ ]============================

  // NOTES
  // Napravicu tako da cu za svaki filter imati posebnu funkciju i samo cu pitati
  // if(filterByColor) je stikliran, tj imamo izabrane boje, onda run tu metodu
  // Tako cu za svaki filter imati if(true) run, else nastavi dalje.
  // Sto znaci da mogu potencijalno da kombinujem sve filtere

  // Napravi komponente za search:
  // 2x checkboxes => [] Na Stanju | [] Rasprodato (tj prikazuje i gde je stock 0)
  // Multiple select dropdown za boje, zatim za svaku boju proveravamo, samo jednom
  // prolazimo, znaci n^2 ce morati da bude zato sto moramo da uporedimo boje
  // checkboxovi za velicine, svaka stiklirana velicina gde je stanje vece od 0

  // Memoize the filtered products
  const filteredData = useMemo(() => {
    return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
  }, [productsCtx.allActiveProducts, searchData, searchParams]);

  // useEffect(() => {
  //   console.log('===================================================================================================')
  //   betterConsoleLog(`> Filtered data [size ${filteredData.length}] is: `, filteredData);
  // }, [filteredData]);

  return (
    <View style={styles.container}>
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        updateSearchParam={updateSearchParam}
      />
      {/* <TouchableWithoutFeedback onPress={handleOutsideClick}> */}
        {/* <View style={{ flex: 1 }}> */}
        {filteredData && filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <DisplayProduct item={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.productsContainer}
          />
        )}
        {/* </View> */}
      {/* </TouchableWithoutFeedback> */}
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