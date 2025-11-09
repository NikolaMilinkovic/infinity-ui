import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import useTextForActiveLanguage from '../../../hooks/useTextForActiveLanguage';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import DropdownList from '../../../util-components/DropdownList';

function LanguageSelector({ updateUserSetting }: { updateUserSetting: (field: string, value: any) => void }) {
  const { user } = useUser();
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  const colors = useThemeColors();
  const styles = getStyles(colors);
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: string;
  }
  const [listSelectorData] = useState([
    { _id: 0, name: 'Engleski', value: 'en' },
    { _id: 1, name: 'Srpski', value: 'srb' },
  ]);
  function getDefaultValue() {
    switch (user?.settings?.language) {
      case 'en':
        return 'Engleski';
      case 'srb':
        return 'Srpski';
    }
  }
  async function updateSetting(selected: DrpodownTypes) {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    updateUserSetting('language', selected.value);
  }

  return (
    <>
      <Text style={styles.text}>{text.language_description}</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={[styles.dropdown, { marginTop: 10 }]}
      />
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 16,
      color: colors.defaultText,
    },
    dropdown: {
      backgroundColor: colors.buttonBackground,
      marginTop: 10,
      elevation: 1,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.secondaryLight,
    },
    dropdownText: {
      color: colors.defaultText,
    },
  });
}

export default LanguageSelector;
