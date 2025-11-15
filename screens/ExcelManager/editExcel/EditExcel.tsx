import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import LinearGradientBackground from '../../../components/gradients/LinearBackgroundGradient';
import { useEndOfDayExcelContext } from '../../../store/excel/end-of-day-excel-presets-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import InputField from '../../../util-components/InputField';
import EditExcelItem from './components/EditExcelItem';

function EditExcel() {
  const ctx = useEndOfDayExcelContext();
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredExcels = ctx.excels.filter((excel) => excel.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: colors.containerBackground }}>
      <LinearGradientBackground
        containerStyles={{ borderRadius: 4 }}
        color1={colors.cardBackground1}
        color2={colors.cardBackground2}
        flex={false}
      >
        <View style={styles.inputContainer}>
          <InputField
            label="Pretraži šablone"
            isSecure={false}
            inputText={searchQuery}
            setInputText={setSearchQuery}
            containerStyles={styles.inputField}
            labelBorders={false}
            background={colors.background}
            displayClearInputButton={true}
            activeColor={colors.highlight}
            selectionColor={colors.highlight}
          />
        </View>
      </LinearGradientBackground>
      <FlatList
        data={filteredExcels}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => <EditExcelItem excel={item} colors={colors} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        ListHeaderComponent={() => (
          <CustomText style={styles.listHeader} variant="bold">
            Ukupno šablona: {ctx.excels.length}
          </CustomText>
        )}
      />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 18,
      paddingTop: 26,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 0.5,
    },
    inputField: {
      backgroundColor: colors.background,
      height: 50,
    },
    list: {
      flex: 1,
      paddingTop: 2,
    },
    listContent: {
      // paddingTop: 2,
      paddingBottom: 50,
      gap: 2,
    },
    listHeader: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 3,
      marginTop: 3,
      color: colors.defaultText,
    },
  });
}

export default EditExcel;
