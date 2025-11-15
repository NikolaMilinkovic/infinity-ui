import { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SuppliersContext } from '../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import CustomText from '../../util-components/CustomText';
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
      (supplier) => supplier.name?.toLowerCase().includes(searchQuery.toLowerCase())
      // supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // supplier.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // supplier.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliersCtx.suppliers, searchQuery]);

  if (isLoading) {
    return <CustomText>Ucitavam dobavljače...</CustomText>;
  }

  function NoSuppliersRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.containerBackground,
      },
      text: {
        color: colors.defaultText,
      },
    });

    return (
      <View style={internalStyle.container}>
        <CustomText style={internalStyle.text}>Trenutno ne postoje dodati dobavljači</CustomText>
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
              selectionColor={colors.defaultText}
              placeholderTextColor={colors.grayText}
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
      backgroundColor: colors.containerBackground,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingTop: 3,
      paddingBottom: 50,
      gap: 2,
    },
    headerWrapper: {
      backgroundColor: colors.background,
      flexDirection: 'row',
      paddingHorizontal: 10,
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
      color: colors.defaultText,
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
