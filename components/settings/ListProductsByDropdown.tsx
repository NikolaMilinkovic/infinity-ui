import { useContext, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useGetAppColors } from '../../constants/useGetAppColors';
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage';
import { UserContext } from '../../store/user-context';
import { AppColors } from '../../types/allTsTypes';
import DropdownList from '../../util-components/DropdownList';

function ListProductsByDropdown({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const styles = getStyles(useGetAppColors());
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
      <Text style={styles.text}>{text.listProductsBy_description}</Text>
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

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    text: {
      fontSize: 16,
      color: Colors.defaultText,
    },
    h2: {},
    dropdown: {
      backgroundColor: Colors.buttonBackground,
      marginTop: 10,
      elevation: 1,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      borderWidth: 0.5,
      borderColor: Colors.secondaryLight,
    },
    dropdownText: {
      color: Colors.defaultText,
    },
  });
}

export default ListProductsByDropdown;
