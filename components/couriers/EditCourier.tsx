import React, { useEffect, useState, useContext } from 'react'
import { ColorsContext } from '../../store/colors-context';
import { View, StyleSheet, Text, FlatList } from 'react-native'
import { Colors } from '../../constants/colors';
import { CourierTypes } from '../../types/allTsTypes';
import { CouriersContext } from '../../store/couriers-context';
import EditCourierItem from './EditCourierItem';

function EditCourier() {
  const couriersCtx = useContext(CouriersContext);  
  const [couriers, setCouriers] = useState<CourierTypes[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchCouriers = async () => {
      setCouriers(couriersCtx.couriers);
      setIsLoading(false);
    };
    fetchCouriers();
  }, [couriersCtx])

  if (isLoading) {
    return <Text>Ucitavam kurire...</Text>;
  }

  function NoCouriersRenderer(){
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      text: {
        
      }
    })

    return (
      <View style={internalStyle.container}>
        <Text style={internalStyle.text}>
          Trenutno ne postoje dodati kuriri
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {couriers.length > 0 ? (
        <FlatList 
          data={couriers} 
          keyExtractor={(item) => item._id} 
          renderItem={(item) => <EditCourierItem data={item.item}/>}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => <Text style={styles.header}>Lista Kurira</Text>}
          initialNumToRender={10}
          removeClippedSubviews={false}
        />
      ) : (
        <NoCouriersRenderer/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.primaryLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'white',
  }
})

export default EditCourier