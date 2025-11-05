import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CouriersContext } from '../../../store/couriers-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { UserContext } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';

function CouriersSettings({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const courierCtx = useContext(CouriersContext);
  const [firstRender, setFirstRender] = useState(true);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: string;
  }
  const [listSelectorData, setListSelectorData] = useState([{ _id: 0, name: '', value: '' }]);
  const [defaultSelection, setDefaultSelection] = useState(
    userCtx.settings.defaults.courier || { _id: 0, name: '', value: '' }
  );
  useEffect(() => {
    let options = [{ _id: 0, name: 'Izaberite default kurira', value: '' }];
    for (const [index, courier] of courierCtx.couriers.entries()) {
      options.push({
        _id: index + 1,
        name: courier.name,
        value: courier.name,
      });
    }
    setListSelectorData(options);
    setDefaultSelection(userCtx.settings.defaults.courier);
  }, [courierCtx.couriers, userCtx.settings.defaults.courier]);

  async function updateSetting(selected: DrpodownTypes) {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (!selected.name || selected.name === '') return;
    updateDefault('courier', selected.value);
  }

  return (
    <>
      <CustomText style={styles.text}>Podešava defaultni izbor kurira prilikom kreiranja nove porudžbine </CustomText>
      <DropdownList
        data={listSelectorData}
        defaultValue={defaultSelection}
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

export default CouriersSettings;
