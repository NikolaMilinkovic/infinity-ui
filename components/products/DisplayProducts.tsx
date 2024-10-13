import React, { useContext, useState, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { DressesContext } from '../../store/dresses-context';
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './DisplayProduct';

function DisplayProducts() {
  const dressesCtx = useContext(DressesContext);
  const [searchData, setSearchData] = useState('');

  // Memoize the filtered dresses
  const filteredDresses = useMemo(() => {

    // Ovde mogu da pitam if search data && stiklirano nesto itd da pravim bolji search
    // Kombinujem search tj
    if (searchData) {
      return dressesCtx.activeDresses.filter((dress) =>
        dress.name.toLowerCase().includes(searchData.toLowerCase())
      );
    }

    return dressesCtx.activeDresses;
  }, [dressesCtx.activeDresses, searchData]);

  return (
    <View style={styles.container}>
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
        />
      <FlatList
        data={filteredDresses}
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