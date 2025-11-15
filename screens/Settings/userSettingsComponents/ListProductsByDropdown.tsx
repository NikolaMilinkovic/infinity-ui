import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useTextForActiveLanguage from '../../../hooks/useTextForActiveLanguage';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import { User } from '../../../types/allTsTypes';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';

function ListProductsByDropdown() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user, setUser } = useUser();
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  async function updateDefault(field: string, value: any) {
    setUser((prevUser: User) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          defaults: {
            ...prevUser.settings?.defaults,
            [field]: value,
          },
        },
      };
    });
  }

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
    switch (user?.settings?.defaults?.listProductsBy) {
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
    <View style={styles.container}>
      <CustomText style={styles.text}>{text.listProductsBy_description}</CustomText>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultSelectionForListProductsBy()}
        onSelect={updateSetting}
        buttonContainerStyles={styles.dropdown}
        buttonTextStyles={styles.dropdownText}
      />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      borderTopColor: colors.borderColor,
      borderTopWidth: 0.5,
      paddingTop: 14,
      marginTop: 8,
    },
    text: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    h2: {},
    dropdown: {
      backgroundColor: colors.background,
      marginTop: 10,
      borderColor: colors.borderColor,
    },
    dropdownText: {
      color: colors.defaultText,
    },
  });
}

export default ListProductsByDropdown;
