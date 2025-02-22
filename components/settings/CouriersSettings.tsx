import { useContext, useEffect, useState } from "react";
import DropdownList from "../../util-components/DropdownList";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../../store/user-context";
import { CouriersContext } from "../../store/couriers-context";

function CouriersSettings({ updateDefault }: {updateDefault: (field: string, value: any) => void}) {

  const userCtx= useContext(UserContext);
  const courierCtx = useContext(CouriersContext);
  const [firstRender, setFirstRender] = useState(true);
  interface DrpodownTypes{
    _id: number
    name: string
    value: string
  }
  const [listSelectorData, setListSelectorData] = useState([
    {_id: 0, name: '', value: ''}
  ]);
  const [defaultSelection, setDefaultSelection] = useState(userCtx.settings.defaults.courier || {_id: 0, name: '', value: ''});
  useEffect(() => {
    let options = [
      {_id: 0, name: 'Izaberite default kurira', value: ''}
    ];
    for(const [index, courier] of courierCtx.couriers.entries()){
      options.push({
        _id: index + 1,
        name: courier.name,
        value: courier.name,
      })
    }
    setListSelectorData(options);
    setDefaultSelection(userCtx.settings.defaults.courier);
    console.log('> Logging the default courier:');
    console.log(userCtx.settings.defaults.courier);
  }, [courierCtx.couriers, userCtx.settings.defaults.courier]);


  async function updateSetting(selected: DrpodownTypes){
    if(firstRender){
      setFirstRender(false);
      return;
    };
    if(!selected.name || selected.name === '') return;
    updateDefault('courier', selected.value);
  }

  return (
    <>
      <Text style={styles.text}>Podešava defaultni izbor kurira prilikom kreiranja nove porudžbine </Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={defaultSelection}
        onSelect={updateSetting}
        buttonContainerStyles={{marginTop: 10,}}
      />
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  h2: {

  }
});

export default CouriersSettings