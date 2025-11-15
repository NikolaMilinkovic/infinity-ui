import Constants from 'expo-constants';
import { useContext, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { UserPermissions } from '../../types/allTsTypes';
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
  boutiqueId: string;
  isSuperAdmin: boolean;
  permissions: UserPermissions;
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
    boutiqueId: '',
    isSuperAdmin: false,
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
        global_dashboard: false,
        excel_manager: false,
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
      boutiques: {
        create: false,
        update: false,
        delete: false,
      },
      excel: {
        create: false,
        update: false,
        delete: false,
      },
    },
  });
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const authCtx = useContext(AuthContext);

  function resetInputs() {
    handleDropdownReset();
    setNewUserData({
      username: '',
      password: '',
      name: '',
      role: 'user',
      boutiqueId: '',
      isSuperAdmin: false,
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
          global_dashboard: false,
          excel_manager: false,
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
        boutiques: {
          create: false,
          update: false,
          delete: false,
        },
        excel: {
          create: false,
          update: false,
          delete: false,
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
          textColor={colors.whiteText}
          backColor={colors.buttonHighlight1}
          backColor1={colors.buttonHighlight2}
        >
          Dodaj korisnika
        </Button>
      </View>
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: colors.background2,
    },
    card: {
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      margin: 10,
      marginBottom: 70,
    },
    success: {
      color: colors.success,
      marginTop: 10,
    },
  });
}

export default AddUser;
