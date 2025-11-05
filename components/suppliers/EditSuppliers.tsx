import { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SuppliersContext } from '../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import EditSupplierItem from './EditSupplierItem';

function EditSuppliers() {
  const suppliersCtx = useContext(SuppliersContext);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    if (suppliersCtx.suppliers) {
      setIsLoading(false);
    }
  }, [suppliersCtx.suppliers]);

  // Filter suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliersCtx.suppliers;
    return suppliersCtx.suppliers.filter(
      (supplier) =>
        supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliersCtx.suppliers, searchQuery]);

  if (isLoading) {
    return <Text>Ucitavam dobavljače...</Text>;
  }

  function NoSuppliersRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });

    return (
      <View style={internalStyle.container}>
        <Text>Trenutno ne postoje dodati dobavljači</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {suppliersCtx.suppliers.length > 0 ? (
        <>
          {/* Header and TextInput moved outside FlatList */}
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>Ukupno dobavljača: {suppliersCtx.suppliers.length}</Text>
            <TextInput
              style={styles.input}
              placeholder="Pretraži dobavljače"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredSuppliers}
            keyExtractor={(item) => item._id}
            renderItem={(item) => <EditSupplierItem data={item.item} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            initialNumToRender={10}
            removeClippedSubviews={false}
          />
        </>
      ) : (
        <NoSuppliersRenderer />
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.primaryLight,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 10,
      gap: 2,
    },
    headerWrapper: {
      backgroundColor: colors.white,
      flexDirection: 'row',
      marginBottom: 6,
      paddingHorizontal: 10,
      borderBottomColor: colors.secondaryLight,
      borderBottomWidth: 0.5,
      elevation: 2,
    },
    header: {
      fontSize: 14,
      fontWeight: 'bold',
      padding: 10,
      backgroundColor: colors.white,
      textAlign: 'center',
    },
    input: {
      borderBottomColor: colors.secondaryLight,
      borderBottomWidth: 1,
      flex: 1,
      marginBottom: 10,
      marginLeft: 10,
      fontSize: 14,
      textAlignVertical: 'bottom',
    },
  });
}

export default EditSuppliers;
