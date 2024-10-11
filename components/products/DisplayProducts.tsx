import React, { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { DressesContext } from '../../store/dresses-context';
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';

function DisplayProducts() {
  const [activeDresses, setActiveDresses] = useState([]);
  const [cachedActiveDresses, setCachedActiveDresses] = useState([]);
  const [inactiveDresses, setInactiveDresses] = useState([]);
  const [searchData, setSearchData] = useState('');
  const dressesCtx = useContext(DressesContext);

  useEffect(() => {
    setActiveDresses(dressesCtx.getActiveDresses);
    setInactiveDresses(dressesCtx.getInactiveDresses);
  }, [dressesCtx]) 

  useEffect(() => {
    if(searchData){
      const filteredData = cachedActiveDresses.filter((dress) => {
        const matchesName = dress.name.toLowerCase().includes(searchData.toLowerCase());
        return matchesName;
      })
      setActiveDresses(filteredData);
    } else {
      setActiveDresses(dressesCtx.getActiveDresses);
    }
  }, [searchData])

  return (
    <ScrollView>
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
      />
      {activeDresses && (
        activeDresses.map((dress) => (
          <View key={dress._id} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{dress.name}</Text>
            <Text>Category: {dress.category}</Text>
            <Text>Price: ${dress.price}</Text>
            <Text>Status: {dress.active ? "Active" : "Inactive"}</Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

export default DisplayProducts