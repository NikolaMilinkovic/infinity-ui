import Constants from 'expo-constants';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGetAppColors } from '../../constants/useGetAppColors';
import { AuthContext } from '../../store/auth-context';
import { useUser } from '../../store/user-context';
import { AppColors } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import InputField from '../../util-components/InputField';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function AddColor() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const Colors = useGetAppColors();
  const styles = getStyles(useGetAppColors());
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
      setError('Boja mora imati ime!');
      popupMessage('Boja mora imati ime!', 'danger');
      return false;
    }
    return true;
  }

  async function addColorHandler() {
    if (!user?.permissions?.colors?.create) {
      return popupMessage('Nemate permisiju za dodavanje boja.', 'danger');
    }
    const validated = validateInput();
    if (!validated) return;

    try {
      const newColor = {
        name: inputText,
        colorCode: '',
      };
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/colors`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color: newColor }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`${newColor.name} boja je uspešno dodata`, 'success');
      resetInputAndError();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja boje');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.controllsContainer}>
        <View style={styles.inputContainer}>
          <InputField
            label="Unesi Boju"
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
            background={Colors.white}
            color={Colors.defaultText}
            activeColor={Colors.highlight}
            labelBorders={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={addColorHandler} textColor={Colors.white} backColor={Colors.highlight}>
            Sačuvaj
          </Button>
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      borderColor: Colors.secondaryLight,
      borderWidth: 0,
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
}

export default AddColor;
