import Constants from 'expo-constants';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import { AuthContext } from '../../../store/auth-context';
import Button from '../../../util-components/Button';
import { popupMessage } from '../../../util-components/PopupMessage';
import NewUserDetails from '../addUserComponents/NewUserDetails';
import NewUserPermissions from '../addUserComponents/NewUserPermissions';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface EditUserModalTypes {
  user: any;
  setUser: any;
}

function EditUserModal({ user, setUser }: EditUserModalTypes) {
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
    <>
      <Text style={styles.header}>Izmena korisnika "{user.username}"</Text>
      <ScrollView style={styles.container}>
        <NewUserDetails
          isExpanded={isExpandedDetails}
          setIsExpanded={setIsExpandedDetails}
          data={user}
          setData={setUser}
          // dropdownRef={dropdownRef}
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
            textColor={Colors.whiteText}
            backColor={Colors.error}
            containerStyles={styles.btn}
          >
            Nazad
          </Button>
          <Button
            onPress={editUserHandler}
            textColor={Colors.whiteText}
            backColor={Colors.secondaryDark}
            containerStyles={styles.btn}
          >
            Sačuvaj izmene
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    minHeight: '100%',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: Colors.primaryDark,
    color: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  success: {
    color: Colors.success,
    marginTop: 10,
  },
  btn: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default EditUserModal;
