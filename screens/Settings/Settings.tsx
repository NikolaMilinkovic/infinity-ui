import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../../util-components/Button'
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods'
import useAuthToken from '../../hooks/useAuthToken'
import DropdownList from '../../util-components/DropdownList'
import { UserContext } from '../../store/user-context'
import { Colors } from '../../constants/colors'
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage'
import { CouriersContext } from '../../store/couriers-context'


function Settings() {
  const authToken = useAuthToken();
  const userCtx = useContext(UserContext);
  const text = useTextForActiveLanguage('settings');

  /**
   * @param field Attribute that we are updating
   * @param value New value that we are assigning to the Attribute
   * @returns Void
   */
  async function updateDefault(field: string, value: any){
    userCtx.setSettings((prevSettings: any) => ({
      ...prevSettings,
      defaults: {
        ...prevSettings.defaults,
        [field]: value,
      },
    }));
  }
  async function updateUserSetting(field: string, value: any){
    userCtx.setSettings((prevSettings: any) => ({
      ...prevSettings,
      [field]: value,
    }))
  }
  
  /**
   * Sends the current user settings to the backend for updating
   */
  async function saveAndUpdateUserSettings(){
    if(!authToken) return;
    const reponse = await handleFetchingWithBodyData(userCtx.settings, authToken,'user/update-user-settings', 'POST');
  }

  return (
    <View style={styles.container}>

      {/* LIST PRODUCTS BY */}
      <Text style={styles.h1}>{text.listProductsBy_header}</Text>
      <View style={styles.sectionOutline}>
        <ListProductsByDropdown
          updateDefault={updateDefault}
        />
      </View>

      {/* NOVA PORUDZBINA */}
      {/* <Text style={styles.h1}>Nova Porudžbina:</Text>
      <View style={styles.sectionOutline}>
        <DefaultCourier
          updateDefault={updateDefault}
        />
      </View> */}


      {/* THEME SELECTOR */}
      {/* <Text style={styles.h1}>{text.theme_header}</Text>
      <View style={styles.sectionOutline}>
        <ThemeSelector
          updateDefault={updateDefault}
        />
      </View> */}

      {/* LANGUAGE SELECTOR */}
      {/* <Text style={styles.h1}>{text.language_header}</Text>
      <View style={styles.sectionOutline}>
        <LanguageSelector
          updateUserSetting={updateUserSetting}
        />
      </View> */}

      {/* SAVE BTN */}
      <Button
        containerStyles={{ marginTop: 10 }}
        onPress={saveAndUpdateUserSettings}
        backColor={Colors.highlight}
        textColor={Colors.white}
      >
        Sačuvaj
      </Button>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  h1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  h2: {

  },
  text: {
    fontSize: 16,
  },
  sectionOutline: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 10,
  }
});

function ListProductsByDropdown({ updateDefault }: { updateDefault: (field: string, value: any) => void }){
  const userCtx = useContext(UserContext);
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
      {/* <Text style={styles.text}>Sortiraj i napravi liste proizvoda po izabranom parametru, ove liste se nalaze iznad liste proizvoda i služe za njihov brži pregled:</Text> */}
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

function ThemeSelector({ updateDefault }: { updateDefault: (field: string, value: any) => void }){
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  interface DrpodownTypes{
    _id: number
    name: string
    value: string
  }
  const [listSelectorData] = useState([
    {_id: 0, name: 'Svetla tema', value: 'light'},
    {_id: 1, name: 'Tamna tema', value: 'dark'},
  ]);
  function getDefaultValue(){
    switch(userCtx?.settings?.defaults?.theme){
      case 'light':
        return 'Svetla tema'
      case 'dark':
        return 'Tamna tema'
    }
  }
  async function updateSetting(selected: DrpodownTypes){
    if(firstRender){
      setFirstRender(false);
      return;
    };
    updateDefault('theme', selected.value);
  }

  return(
    <>
      <Text style={styles.text}>{text.theme_description}</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={{marginTop: 10,}}
      />
    </>
  )
}

function LanguageSelector({ updateUserSetting }: { updateUserSetting: (field: string, value: any) => void }){
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  interface DrpodownTypes{
    _id: number
    name: string
    value: string
  }
  const [listSelectorData] = useState([
    {_id: 0, name: 'Engleski', value: 'en'},
    {_id: 1, name: 'Srpski', value: 'srb'},
  ]);
  function getDefaultValue(){
    switch(userCtx?.settings?.language){
      case 'en':
        return 'Engleski'
      case 'srb':
        return 'Srpski'
    }
  }
  async function updateSetting(selected: DrpodownTypes){
    if(firstRender){
      setFirstRender(false);
      return;
    };
    updateUserSetting('language', selected.value);
  }

  return(
    <>
      <Text style={styles.text}>{text.language_description}</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={{marginTop: 10,}}
      />
    </>
  )
}

function DefaultCourier({ updateDefault }: { updateDefault: (field: string, value: any) => void }){
  const userCtx = useContext(UserContext);
  const courierCtx = useContext(CouriersContext);
  
  const [firstRender, setFirstRender] = useState(true);
  interface DrpodownTypes{
    _id: number
    name: string
    value: string
  }
  
  useEffect(() => {
    function generateOptionsHandler(){
      console.log('> generateOptionsHandler called');
      let options = [];
      for(const [index, courier] of courierCtx.couriers.entries()){
        console.log(`Index: ${index}, courier: ${courier}`);
      }
    }
    let test = generateOptionsHandler();
  }, [courierCtx.couriers]);
  const [listSelectorData] = useState([
    {_id: 0, name: 'Svetla tema', value: 'light'},
    {_id: 1, name: 'Tamna tema', value: 'dark'},
  ]);
  function getDefaultValue(){
    switch(userCtx?.settings?.defaults?.theme){
      case 'light':
        return 'Svetla tema'
      case 'dark':
        return 'Tamna tema'
    }
  }
  async function updateSetting(selected: DrpodownTypes){
    if(firstRender){
      setFirstRender(false);
      return;
    };
    updateDefault('theme', selected.value);
  }

  return(
    <>
      <Text style={styles.text}>Postavka defaultnog izabranog kurira prilikom kreiranja nove porudžbine:</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={{marginTop: 10,}}
      />
    </>
  )
}

export default Settings