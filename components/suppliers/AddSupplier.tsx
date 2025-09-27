import Constants from 'expo-constants';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { AuthContext } from '../../store/auth-context';
import { useUser } from '../../store/user-context';
import Button from '../../util-components/Button';
import InputField from '../../util-components/InputField';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function AddSupplier() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const user = useUser();

  function resetInputAndError() {
    setInputText('');
    setError('');
  }
  function resetError() {
    setError('');
  }
  function validateInput() {
    resetError();
    if (inputText.trim() === '') {
      setError('Dobavljač mora imati ime!');
      popupMessage('Dobavljač mora imati ime!', 'danger');
      return false;
    }
    return true;
  }

  async function addSupplierHandler() {
    if (!user?.permissions?.suppliers?.create) {
      return popupMessage('Nemate dozvolu za dodavanje dobavljača', 'danger');
    }
    const validated = validateInput();
    if (!validated) return;

    try {
      const newSupplier = {
        name: inputText,
      };
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplier: newSupplier }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Dobavljač ${newSupplier.name} je uspešno dodat`, 'success');
      resetInputAndError();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja dobavljača');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.controllsContainer}>
        <View style={styles.inputContainer}>
          <InputField
            label="Unesi Dobavljača"
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.highlight}
            labelBorders={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={addSupplierHandler} textColor={Colors.white} backColor={Colors.highlight}>
            Sačuvaj
          </Button>
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  controllsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flex: 0.6,
  },
  buttonContainer: {
    flex: 0.4,
  },
  error: {
    color: Colors.error,
    marginTop: 10,
  },
  success: {
    color: Colors.success,
    marginTop: 10,
  },
});

export default AddSupplier;
