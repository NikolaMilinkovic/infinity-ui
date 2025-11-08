import { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoriesContext } from '../../store/categories-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { CategoryTypes } from '../../types/allTsTypes';
import EditCategoriesItem from './EditCategoriesItem';

function EditCategories() {
  const categoriesCtx = useContext(CategoriesContext);

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const styles = getStyles(colors);

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
              selectionColor={colors.defaultText}
              placeholderTextColor={colors.grayText}
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
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.containerBackground,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingTop: 2,
      paddingBottom: 50,
      gap: 2,
    },
    headerWrapper: {
      backgroundColor: colors.background,
      flexDirection: 'row',
      paddingHorizontal: 10,
      marginTop: -2,
    },
    header: {
      fontSize: 14,
      fontWeight: 'bold',
      padding: 10,
      backgroundColor: colors.background,
      textAlign: 'center',
      color: colors.defaultText,
    },
    input: {
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
      flex: 1,
      marginBottom: 10,
      marginLeft: 10,
      fontSize: 14,
      textAlignVertical: 'bottom',
      color: colors.defaultText,
    },
  });
}
export default EditCategories;
