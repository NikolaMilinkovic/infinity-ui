import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGetAppColors } from '../../constants/useGetAppColors';
import { ColorsContext } from '../../store/colors-context';
import { AppColors, ColorType } from '../../types/allTsTypes';
import EditColorItem from './EditColorItem';

function EditColors() {
  const colorsCtx = useContext(ColorsContext);
  const [colors, setColors] = useState<ColorType[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const Colors = useGetAppColors();
  const styles = getStyles(Colors);

  useEffect(() => {
    const fetchColors = async () => {
      const ctxColors = colorsCtx.getColors();
      setColors(ctxColors);
      setIsLoading(false);
    };
    fetchColors();
  }, [colorsCtx]);

  // Filter colors based on search query
  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return colors;
    return colors.filter(
      (color) =>
        color.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        color.hex?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [colors, searchQuery]);

  if (isLoading) {
    return <Text>Ucitavam boje...</Text>;
  }

  function NoColorRenderer() {
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
        <Text style={internalStyle.text}>Trenutno ne postoje dodate boje</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {colors.length > 0 ? (
        <>
          {/* Header and TextInput moved outside FlatList */}
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>Ukupno boja: {colors.length}</Text>
            <TextInput
              style={styles.input}
              placeholder="Pretraži boje"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredColors}
            keyExtractor={(item) => item._id}
            renderItem={(item) => <EditColorItem data={item.item} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            initialNumToRender={10}
            removeClippedSubviews={false}
          />
        </>
      ) : (
        <NoColorRenderer />
      )}
    </View>
  );
}

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
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
      marginBottom: 6,
      paddingHorizontal: 10,
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
}

export default EditColors;
