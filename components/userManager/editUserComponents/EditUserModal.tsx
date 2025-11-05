import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import Button from '../../../util-components/Button';
import { popupMessage } from '../../../util-components/PopupMessage';
import ModalHeader from '../../modals/components/ModalHeader';
import NewUserDetails from '../addUserComponents/NewUserDetails';
import NewUserPermissions from '../addUserComponents/NewUserPermissions';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface EditUserModalTypes {
  user: any;
  setUser: any;
}

function EditUserModal({ user, setUser }: EditUserModalTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [isExpandedDetails, setIsExpandedDetails] = useState(true);
  const [isExpandedPermissions, setIsExpandedPermissions] = useState(true);
  const authCtx = useContext(AuthContext);

  function cancelHandler() {
    setUser(null);
  }
  async function editUserHandler() {
    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/user/update-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Korisnik je uspešno ažuriran`, 'success');
      cancelHandler();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom ažuriranja korisnika');
    }
  }

  return (
    <View>
      <ModalHeader title={`Izmena korisnika "${user.username}"`} />

      {/* CONTENT */}
      <ScrollView style={styles.container}>
        <NewUserDetails
          isExpanded={isExpandedDetails}
          setIsExpanded={setIsExpandedDetails}
          data={user}
          setData={setUser}
        />

        {/* PERMISSIONS */}
        <NewUserPermissions
          isExpanded={isExpandedPermissions}
          setIsExpanded={setIsExpandedPermissions}
          data={user}
          setData={setUser}
        />

        <View style={styles.buttonsContainer}>
          <Button
            onPress={cancelHandler}
            textColor={colors.defaultText}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
            containerStyles={styles.button}
          >
            Nazad
          </Button>
          <Button
            onPress={editUserHandler}
            textColor={colors.whiteText}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
            containerStyles={styles.button}
          >
            Sačuvaj izmene
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 2,
      height: 60,
      backgroundColor: colors.primaryDark,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHeader: {
      color: colors.highlightText,
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    container: {
      marginTop: 10,
      backgroundColor: colors.background,
      padding: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      backgroundColor: colors.primaryDark,
      color: colors.white,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    success: {
      color: colors.success,
      marginTop: 10,
    },
    button: {
      flex: 1,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
  });
}

export default EditUserModal;
