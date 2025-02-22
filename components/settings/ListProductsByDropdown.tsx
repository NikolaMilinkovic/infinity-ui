import { useContext, useState } from "react";
import useTextForActiveLanguage from "../../hooks/useTextForActiveLanguage";
import DropdownList from "../../util-components/DropdownList";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../../store/user-context";

function ListProductsByDropdown({ updateDefault }: { updateDefault: (field: string, value: any) => void}){
  const userCtx= useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  interface DrpodownTypes{
    _id: number
    name: string
    value: string
  }
  const [listSelectorData] = useState([
    {_id: 0, name: 'Dobavljač', value: 'supplier'},
    {_id: 1, name: 'Kategorija', value: 'category'},
    {_id: 2, name: 'Samo jedna lista', value: 'one_list'}
  ]);
  function getDefaultSelectionForListProductsBy(){
    switch(userCtx?.settings?.defaults?.listProductsBy){
      case 'supplier':
        return 'Dobavljač'
      case 'category':
        return 'Kategorija'
      case 'one_list':
        return 'Samo jedna lista'
    }
  }
  async function updateSetting(selected: DrpodownTypes){
    if(firstRender){
      setFirstRender(false);
      return;
    };
    updateDefault('listProductsBy', selected.value);
  }
  
  return(
    <>
      <Text style={styles.text}>{text.listProductsBy_description}</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultSelectionForListProductsBy()}
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
});

export default ListProductsByDropdown;