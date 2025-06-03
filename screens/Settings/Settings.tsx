import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckForUpdates from '../../components/settings/CheckForUpdates';
import CouriersSettings from '../../components/settings/CouriersSettings';
import ListProductsByDropdown from '../../components/settings/ListProductsByDropdown';
import { useGetAppColors } from '../../constants/useGetAppColors';
import useAuthToken from '../../hooks/useAuthToken';
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage';
import { AppContext } from '../../store/app-context';
import { CouriersContext } from '../../store/couriers-context';
import { UserContext } from '../../store/user-context';
import { AppColors } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';
import { popupMessage } from '../../util-components/PopupMessage';
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods';

function Settings() {
  const authToken = useAuthToken();
  const userCtx = useContext(UserContext);
  const text = useTextForActiveLanguage('settings');
  const appCtx = useContext(AppContext);
  const styles = getStyles(useGetAppColors());

  /**
   * @param field Attribute that we are updating
   * @param value New value that we are assigning to the Attribute
   * @returns Void
   */
  async function updateDefault(field: string, value: any) {
    userCtx.setSettings((prevSettings: any) => ({
      ...prevSettings,
      defaults: {
        ...prevSettings.defaults,
        [field]: value,
      },
    }));
  }
  async function updateUserSetting(field: string, value: any) {
    userCtx.setSettings((prevSettings: any) => ({
      ...prevSettings,
      [field]: value,
    }));
  }

  /**
   * Sends the current user settings to the backend for updating
   */
  async function saveAndUpdateUserSettings() {
    if (!authToken) return;
    const response = await handleFetchingWithBodyData(userCtx.settings, authToken, 'user/update-user-settings', 'POST');
    if (!response) return;
    if (response.status === 200) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'success');
    } else {
      popupMessage('Došlo je do problema prilikom ažuriranja podešavanja', 'danger');
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* LIST PRODUCTS BY */}
      <Text style={styles.h1}>{text.listProductsBy_header}</Text>
      <View style={styles.sectionOutline}>
        <ListProductsByDropdown updateDefault={updateDefault} />
      </View>

      {/* DEFAULT COURIER */}
      <Text style={styles.h1}>Kuriri</Text>
      <View style={styles.sectionOutline}>
        <CouriersSettings updateDefault={updateDefault} />
      </View>

      {/* UPDATES */}
      <Text style={styles.h1}>Ažuriranje | Updates:</Text>
      <View style={styles.sectionOutline}>
        <CheckForUpdates appCtx={appCtx} />
      </View>

      {/* NOVA PORUDZBINA */}
      {/* <Text style={styles.h1}>Nova Porudžbina:</Text>
      <View style={styles.sectionOutline}>
        <DefaultCourier
          updateDefault={updateDefault}
        />
      </View> */}

      {/* THEME SELECTOR */}
      <Text style={styles.h1}>{text.theme_header}</Text>
      <View style={styles.sectionOutline}>
        <ThemeSelector updateDefault={updateDefault} />
      </View>

      {/* LANGUAGE SELECTOR */}
      {/* <Text style={styles.h1}>{text.language_header}</Text>
      <View style={styles.sectionOutline}>
        <LanguageSelector
          updateUserSetting={updateUserSetting}
        />
      </View> */}

      {/* SAVE BTN */}
      <Button
        containerStyles={styles.saveButton}
        onPress={saveAndUpdateUserSettings}
        textStyles={styles.saveButtonText}
      >
        Sačuvaj
      </Button>
    </ScrollView>
  );
}

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: Colors.primaryLight,
    },
    h1: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16,
      color: Colors.defaultText,
    },
    h2: {
      color: Colors.defaultText,
    },
    text: {
      fontSize: 16,
      color: Colors.defaultText,
    },
    sectionOutline: {
      padding: 10,
      borderWidth: 0.5,
      borderColor: Colors.borders,
      borderRadius: 10,
    },
    dropdown: {
      backgroundColor: Colors.buttonBackground,
      marginTop: 10,
      elevation: 2,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    dropdownText: {
      color: Colors.defaultText,
    },
    saveButton: {
      backgroundColor: Colors.highlight,
      marginTop: 10,
      marginBottom: 20,
    },
    saveButtonText: {
      color: Colors.white,
    },
  });
}

function ThemeSelector({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  const styles = getStyles(useGetAppColors());
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: string;
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
  }

  return (
    <>
      <Text style={styles.text}>{text.theme_description}</Text>
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

function LanguageSelector({ updateUserSetting }: { updateUserSetting: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const [firstRender, setFirstRender] = useState(true);
  const text = useTextForActiveLanguage('settings');
  const styles = getStyles(useGetAppColors());
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
    switch (userCtx?.settings?.language) {
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
        buttonContainerStyles={{ marginTop: 10 }}
      />
    </>
  );
}

function DefaultCourier({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const userCtx = useContext(UserContext);
  const courierCtx = useContext(CouriersContext);
  const styles = getStyles(useGetAppColors());
  const [firstRender, setFirstRender] = useState(true);
  interface DrpodownTypes {
    _id: number;
    name: string;
    value: string;
  }

  useEffect(() => {
    function generateOptionsHandler() {
      let options = [];
      // for (const [index, courier] of courierCtx.couriers.entries()) {
      //   console.log(`Index: ${index}, courier: ${courier}`);
      // }
    }
    let test = generateOptionsHandler();
  }, [courierCtx.couriers]);
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
  }

  return (
    <>
      <Text style={styles.text}>Postavka defaultnog izabranog kurira prilikom kreiranja nove porudžbine:</Text>
      <DropdownList
        data={listSelectorData}
        defaultValue={getDefaultValue()}
        onSelect={updateSetting}
        buttonContainerStyles={{ marginTop: 10 }}
      />
    </>
  );
}

export default Settings;
