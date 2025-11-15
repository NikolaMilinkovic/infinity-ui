import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenCardLayout from '../../../components/layout/ScreenCardLayout';
import { BoutiqueTypes, useBoutiques } from '../../../store/superAdmin/boutiques-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import EditBoutiqueItem from './EditBoutiqueItem';

function EditBoutique() {
  const { boutiques } = useBoutiques();
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const filteredBoutiques = useMemo(() => {
    if (!searchQuery.trim()) return boutiques;
    return boutiques.filter((boutique: BoutiqueTypes) =>
      boutique.boutiqueName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [boutiques, searchQuery]);
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Ukupno klijenata: {boutiques.length}</Text>
        <TextInput
          style={styles.input}
          placeholder="Pretraži klijente"
          value={searchQuery}
          onChangeText={setSearchQuery}
          selectionColor={colors.defaultText}
          placeholderTextColor={colors.grayText}
        />
      </View>
      <ScreenCardLayout>
        <FlatList
          data={filteredBoutiques}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => <EditBoutiqueItem boutique={item} colors={colors} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      </ScreenCardLayout>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: {
      flex: 1,
      paddingTop: 2,
    },
    listContent: {
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
export default EditBoutique;
