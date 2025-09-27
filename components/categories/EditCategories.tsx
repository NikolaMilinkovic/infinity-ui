import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import { CategoryTypes } from '../../types/allTsTypes';
import EditCategoriesItem from './EditCategoriesItem';

function EditCategories() {
  const categoriesCtx = useContext(CategoriesContext);

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const ctxCategories = categoriesCtx.getCategories();
      setCategories(ctxCategories.sort((a, b) => (b.stockType || '').localeCompare(a.stockType || '')));
      setIsLoading(false);
    };
    fetchCategories();
  }, [categoriesCtx]);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.stockType?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  if (isLoading) {
    return <Text>Učitavam kategorije...</Text>;
  }

  function NoCategoriesRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {},
    });

    return (
      <View style={internalStyle.container}>
        <Text style={internalStyle.text}>Trenutno ne postoje dodate kategorije</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.length > 0 ? (
        <>
          {/* Header and TextInput moved outside FlatList */}
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>Ukupno kategorija: {categories.length}</Text>
            <TextInput
              style={styles.input}
              placeholder="Pretraži kategorije"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item._id}
            renderItem={(item) => <EditCategoriesItem data={item.item} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            initialNumToRender={10}
            removeClippedSubviews={false}
          />
        </>
      ) : (
        <NoCategoriesRenderer />
      )}
    </View>
  );
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
    paddingBottom: 10,
    gap: 2,
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 6,
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 0.5,
    elevation: 2,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: Colors.white,
    textAlign: 'center',
  },
  input: {
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
    textAlignVertical: 'bottom',
  },
});

export default EditCategories;
