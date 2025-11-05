import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import useTextForActiveLanguage from '../../../hooks/useTextForActiveLanguage';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { UserContext } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';

function ListProductsByDropdown({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: string;
  }
  const [listSelectorData] = useState([
    { _id: 0, name: 'Dobavljač', value: 'supplier' },
    { _id: 1, name: 'Kategorija', value: 'category' },
    { _id: 2, name: 'Samo jedna lista', value: 'one_list' },
  ]);
  function getDefaultSelectionForListProductsBy() {
    switch (userCtx?.settings?.defaults?.listProductsBy) {
      case 'supplier':
        return 'Dobavljač';
      case 'category':
        return 'Kategorija';
      case 'one_list':
        return 'Samo jedna lista';
    }
  }
  async function updateSetting(selected: DrpodownTypes) {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    updateDefault('listProductsBy', selected.value);
  }

  return (
    <>
      <CustomText style={styles.text}>{text.listProductsBy_description}</CustomText>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultSelectionForListProductsBy()}
        onSelect={updateSetting}
        buttonContainerStyles={styles.dropdown}
        buttonTextStyles={styles.dropdownText}
      />
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
    h2: {},
    dropdown: {
      backgroundColor: colors.background,
      marginTop: 10,
      elevation: 1,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
    },
    dropdownText: {
      color: colors.defaultText,
    },
  });
}

export default ListProductsByDropdown;
