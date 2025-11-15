import { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { ColorsContext } from '../../store/colors-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { ColorTypes } from '../../types/allTsTypes';
import CustomText from '../../util-components/CustomText';
import EditColorItem from './EditColorItem';

function EditColors() {
  const colorsCtx = useContext(ColorsContext);
  const [colors, setColors] = useState<ColorTypes[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  useEffect(() => {
    const fetchColors = async () => {
      const ctxColors = colorsCtx.colors;
      setColors(ctxColors);
      setIsLoading(false);
    };
    fetchColors();
  }, [colorsCtx]);

  // Filter colors based on search query
  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return colors;
    return colors.filter(
      (color: ColorTypes) =>
        color.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        color.colorCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [colors, searchQuery]);

  if (isLoading) {
    return <CustomText style={{ color: themeColors.defaultText }}>Ucitavam boje...</CustomText>;
  }

  function NoColorRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: themeColors.defaultText,
      },
    });

    return (
      <View style={internalStyle.container}>
        <CustomText style={internalStyle.text}>Trenutno ne postoje dodate boje</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {colors.length > 0 ? (
        <>
          {/* Header and TextInput moved outside FlatList */}
          <View style={styles.headerWrapper}>
            <CustomText variant="medium" style={styles.header}>
              Ukupno boja: {colors.length}
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="Pretraži boje"
              value={searchQuery}
              onChangeText={setSearchQuery}
              selectionColor={themeColors.defaultText}
              placeholderTextColor={themeColors.grayText}
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
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          />
        </>
      ) : (
        <NoColorRenderer />
      )}
    </View>
  );
}

function getStyles(themeColors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.containerBackground,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingTop: 2,
      paddingBottom: 50,
      gap: 0,
    },
    headerWrapper: {
      backgroundColor: themeColors.background,
      flexDirection: 'row',
      paddingHorizontal: 10,
      marginTop: -2,
    },
    header: {
      fontSize: 14,
      fontWeight: 'bold',
      padding: 10,
      marginTop: 1,
      textAlign: 'center',
      color: themeColors.defaultText,
    },
    input: {
      borderBottomColor: themeColors.borderColor,
      borderBottomWidth: 1,
      flex: 1,
      marginBottom: 10,
      marginLeft: 10,
      fontSize: 14,
      textAlignVertical: 'bottom',
      color: themeColors.defaultText,
    },
  });
}

export default EditColors;
