import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import useTextForActiveLanguage from '../../../hooks/useTextForActiveLanguage';
import { ThemeColors, useTheme, useThemeColors } from '../../../store/theme-context';
import { UserContext } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';

function ThemeSelector({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  const colors = useThemeColors();
  const themeContext = useTheme();
  const styles = getStyles(colors);
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: 'light' | 'dark';
  }
  const [listSelectorData] = useState([
    { _id: 0, name: 'Svetla tema', value: 'light' },
    { _id: 1, name: 'Tamna tema', value: 'dark' },
  ]);
  function getDefaultValue() {
    switch (userCtx?.settings?.defaults?.theme) {
      case 'light':
        return 'Svetla tema';
      case 'dark':
        return 'Tamna tema';
    }
  }
  async function updateSetting(selected: DrpodownTypes) {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    updateDefault('theme', selected.value);
    themeContext.setTheme(selected.value);
  }

  return (
    <>
      <CustomText style={styles.text}>{text.theme_description}</CustomText>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={styles.dropdown}
        buttonTextStyles={styles.dropdownText}
      />
    </>
  );
}

export default ThemeSelector;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
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
