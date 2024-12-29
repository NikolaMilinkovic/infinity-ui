import React, { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import { Colors } from '../../constants/colors';
import { SuppliersContext } from '../../store/suppliers-context';
import { SupplierTypes } from '../../types/allTsTypes';
import EditSupplierItem from './EditSupplierItem';

function EditSuppliers() {
  const suppliersCtx = useContext(SuppliersContext);  
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    if(suppliersCtx.suppliers.length !== 0){
      setIsLoading(false);
    }
  }, [suppliersCtx.suppliers]);
  
  if (isLoading) {
    return <Text>Ucitavam dobavljače...</Text>;
  }

  function NoSuppliersRenderer(){
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
    })

    return (
      <View style={internalStyle.container}>
        <Text>
          Trenutno ne postoje dodati dobavljači
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {suppliersCtx.suppliers.length > 0 ? (
        <FlatList 
          data={suppliersCtx.suppliers} 
          keyExtractor={(item) => item._id} 
          renderItem={(item) => <EditSupplierItem data={item.item}/>}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => <Text style={styles.header}>Lista Dobavljača</Text>}
          initialNumToRender={10}
          removeClippedSubviews={false}
        />
      ) : (
        <NoSuppliersRenderer/>
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

export default EditSuppliers