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

function AddCourier() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('');
  const [inputPrice, setInputPrice] = useState<number>('');
  const [error, setError] = useState<string>('');
  const user = useUser();

  function resetInputAndError() {
    setInputText('');
    setInputPrice(0);
    setError('');
  }
  function resetError() {
    setError('');
  }
  function validateInput() {
    resetError();
    if (inputText.trim() === '') {
      setError('Kurir mora imati ime!');
      popupMessage('Kurir mora imati ime!', 'danger');
      return false;
    }
    if (!inputPrice) {
      setError('Kurir mora imati cenu dostave!');
      popupMessage('Kurir mora imati cenu dostave!', 'danger');
      return false;
    }
    return true;
  }

  async function addCourierHandler() {
    if (!user?.permissions?.couriers?.create) {
      return popupMessage('Nemate permisiju za dodavanje kurira.', 'danger');
    }
    const validated = validateInput();
    if (!validated) return;

    try {
      const newCourier = {
        name: inputText,
        deliveryPrice: inputPrice,
      };
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/couriers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courier: newCourier }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Kurir ${newCourier.name} je uspešno dodat`, 'success');
      resetInputAndError();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja kurira');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.controllsContainer}>
        <View style={styles.inputContainer}>
          <InputField
            label="Unesi Kurira"
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.highlight}
            labelBorders={false}
            containerStyles={{ flex: 1 }}
          />
          <InputField
            label="Cena dostave"
            isSecure={false}
            inputText={inputPrice}
            setInputText={setInputPrice}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.highlight}
            labelBorders={false}
            keyboard="number-pad"
            containerStyles={{ flex: 1 }}
          />
        </View>
        <Button onPress={addCourierHandler} textColor={Colors.white} backColor={Colors.highlight}>
          Sačuvaj
        </Button>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.primaryDark,
    borderWidth: 0,
    paddingVertical: 16,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  controllsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
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

export default AddCourier;
