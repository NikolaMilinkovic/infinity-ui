import React, { useEffect, useState, useContext } from 'react'
import { CategoriesContext } from '../../store/categories-context';
import { View, StyleSheet, Text, FlatList } from 'react-native'
import EditCategoriesItem from './EditCategoriesItem';
import { Colors } from '../../constants/colors';

function EditCategories() {
  const categoriesCtx = useContext(CategoriesContext);

  interface CategoryType {
    _id: string
    name: string
  }
  
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const ctxCategories = categoriesCtx.getCategories();
      setCategories(ctxCategories);
      setIsLoading(false);
    };
    fetchCategories();
  }, [categoriesCtx])

  if (isLoading) {
    return <Text>Ucitavam kategorije...</Text>;
  }

  function NoCategoriesRenderer(){
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
          Trenutno ne postoje dodate kategorije
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {categories.length > 0 ? (
        <FlatList 
          data={categories} 
          keyExtractor={(item) => item._id} 
          renderItem={(item) => <EditCategoriesItem data={item.item}/>}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => <Text style={styles.header}>Lista Kategorija</Text>}
          initialNumToRender={10}
          removeClippedSubviews={false}
        />
      ) : (
        <NoCategoriesRenderer/>
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

export default EditCategories