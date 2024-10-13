import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { DressesContext } from '../../store/dresses-context';
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';

function DisplayProducts() {
  const dressesCtx = useContext(DressesContext);
  const productsCtx = useContext(AllProductsContext);
  const [searchData, setSearchData] = useState('');
  const [searchColors, setSearchColors] = useState([]);

  function filterByColor(){
    const colorBasedSearch = productsCtx.allActiveProducts.filter((item) =>
      item.colors.some((colorObj) => 
        colorObj.color.toLowerCase().includes(searchData.toLowerCase())
      )
    );
    return colorBasedSearch;
  }


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
  


  // Memoize the filtered dresses
  const filteredProducts = useMemo(() => {
    if (searchData) {
      const nameBasedSearch = productsCtx.allActiveProducts.filter((item) =>
        item.name.toLowerCase().includes(searchData.toLowerCase())
      );
      const colorBasedSearch = filterByColor()
      const combinedResults = [...new Set([...nameBasedSearch, ...colorBasedSearch])];
      const stockFilteredResults = combinedResults.filter((result) => {
        // On Stock for Haljina
        if (result.category === 'Haljina') {
          return result.colors.some((colorObj) =>
            colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
          );
        }
        // On Stock for Torbica
        if (result.category === 'Torbica') {
          return result.colors.some((colorObj) => colorObj.stock > 0);
        }
        // On Stock for the rest of categories
        return result.colors.some((colorObj) =>
          colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
        );
      });
      return stockFilteredResults;
    }

    return productsCtx.allActiveProducts;
  }, [productsCtx.allActiveProducts, searchData]);

  return (
    <View style={styles.container}>
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
        />
      <FlatList
        data={filteredProducts}
        renderItem={({item})=>(
          <DisplayProduct 
            item={item}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productsContainer}
      />
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