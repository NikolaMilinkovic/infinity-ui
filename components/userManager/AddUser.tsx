import Constants from 'expo-constants';
import React, { useContext, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useGetAppColors } from '../../constants/useGetAppColors';
import { AuthContext } from '../../store/auth-context';
import { AppColors } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import { popupMessage } from '../../util-components/PopupMessage';
import NewUserDetails from './addUserComponents/NewUserDetails';
import NewUserPermissions from './addUserComponents/NewUserPermissions';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface cud {
  create: boolean;
  update: boolean;
  delete: boolean;
}
interface NewUserDataTypes {
  username: string;
  password: string;
  name: string;
  role: string;
  permissions: {
    navigation: {
      lista_artikla: boolean;
      porudzbine_rezervacije: boolean;
      boje_kategorije_dobavljaci: boolean;
      kuriri: boolean;
      dodaj_artikal: boolean;
      upravljanje_korisnicima: boolean;
      podesavanja: boolean;
      zavrsi_dan: boolean;
      admin_dashboard: boolean;
    };
    products: cud;
    orders: cud;
    packaging: {
      check: boolean;
      finish_packaging: boolean;
    };
    colors: cud;
    categories: cud;
    suppliers: cud;
    couriers: cud;
  };
}

function AddUser() {
  const [isExpandedDetails, setIsExpandedDetails] = useState<boolean>(true);
  const [isExpandedPermissions, setIsExpandedPermissions] = useState<boolean>(true);
  const dropdownRef = useRef<any>(null);
  const handleDropdownReset = () => {
    dropdownRef.current?.reset();
  };
  const [newUserData, setNewUserData] = useState<NewUserDataTypes>({
    username: '',
    password: '',
    name: '',
    role: 'user',
    permissions: {
      navigation: {
        lista_artikla: true,
        porudzbine_rezervacije: true,
        boje_kategorije_dobavljaci: true,
        kuriri: true,
        dodaj_artikal: true,
        upravljanje_korisnicima: false,
        podesavanja: true,
        zavrsi_dan: true,
        admin_dashboard: false,
      },
      products: {
        create: true,
        update: true,
        delete: true,
      },
      orders: {
        create: true,
        update: true,
        delete: true,
      },
      packaging: {
        check: true,
        finish_packaging: true,
      },
      colors: {
        create: true,
        update: true,
        delete: true,
      },
      categories: {
        create: true,
        update: true,
        delete: true,
      },
      suppliers: {
        create: true,
        update: true,
        delete: true,
      },
      couriers: {
        create: true,
        update: true,
        delete: true,
      },
    },
  });
  const Colors = useGetAppColors();
  const styles = getStyles(useGetAppColors());
  const authCtx = useContext(AuthContext);

  function resetInputs() {
    handleDropdownReset();
    setNewUserData({
      username: '',
      password: '',
      name: '',
      role: 'user',
      permissions: {
        navigation: {
          lista_artikla: true,
          porudzbine_rezervacije: true,
          boje_kategorije_dobavljaci: true,
          kuriri: true,
          dodaj_artikal: true,
          upravljanje_korisnicima: false,
          podesavanja: true,
          zavrsi_dan: true,
          admin_dashboard: false,
        },
        products: {
          create: true,
          update: true,
          delete: true,
        },
        orders: {
          create: true,
          update: true,
          delete: true,
        },
        packaging: {
          check: true,
          finish_packaging: true,
        },
        colors: {
          create: true,
          update: true,
          delete: true,
        },
        categories: {
          create: true,
          update: true,
          delete: true,
        },
        suppliers: {
          create: true,
          update: true,
          delete: true,
        },
        couriers: {
          create: true,
          update: true,
          delete: true,
        },
      },
    });
  }

  // VALIDATE INPUT BEORE ADDING A NEW USER
  function validateInput() {
    if (!newUserData.username) {
      popupMessage('Username korisnika je obavezan', 'info');
      return false;
    }
    if (!newUserData.password) {
      popupMessage('Password korisnika je obavezan', 'info');
      return false;
    }
    return true;
  }

  async function addUserHandler() {
    const validated = validateInput();
    if (!validated) return;

    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/user/add-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: newUserData }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Korisnik je uspešno kreiran`, 'success');
      resetInputs();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja korisnika');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <NewUserDetails
          isExpanded={isExpandedDetails}
          setIsExpanded={setIsExpandedDetails}
          data={newUserData}
          setData={setNewUserData}
          dropdownRef={dropdownRef}
        />

        {/* PERMISSIONS */}
        <NewUserPermissions
          isExpanded={isExpandedPermissions}
          setIsExpanded={setIsExpandedPermissions}
          data={newUserData}
          setData={setNewUserData}
        />

        <Button
          onPress={addUserHandler}
          textColor={Colors.whiteText}
          backColor={Colors.highlight}
          containerStyles={styles.add_Btn}
        >
          Dodaj korisnika
        </Button>
      </View>
    </ScrollView>
  );
}

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: Colors.primaryLight,
    },
    card: {
      backgroundColor: Colors.white,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.secondaryLight,
      marginBottom: 16,
      margin: 10,
    },
    success: {
      color: Colors.success,
      marginTop: 10,
    },
  });
}

export default AddUser;
