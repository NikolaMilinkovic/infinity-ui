import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useGetAppColors } from '../../constants/useGetAppColors';
import { CouriersContext } from '../../store/couriers-context';
import { UserContext } from '../../store/user-context';
import { AppColors } from '../../types/allTsTypes';
import DropdownList from '../../util-components/DropdownList';

function CouriersSettings({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const courierCtx = useContext(CouriersContext);
  const [firstRender, setFirstRender] = useState(true);
  const styles = getStyles(useGetAppColors());
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
      <Text style={styles.text}>Podešava defaultni izbor kurira prilikom kreiranja nove porudžbine </Text>
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

export default CouriersSettings;
