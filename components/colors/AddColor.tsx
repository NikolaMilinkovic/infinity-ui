import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import Button from '../../util-components/Button';
import InputField from '../../util-components/InputField';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function AddColor() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const colors = useThemeColors();
  const styles = getStyles(colors);
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
            background={colors.background}
            color={colors.defaultText}
            activeColor={colors.highlight}
            labelBorders={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={addColorHandler} textColor={colors.white} backColor={colors.highlight}>
            Sačuvaj
          </Button>
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 8,
      backgroundColor: colors.background,
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
      color: colors.error,
      marginTop: 10,
    },
    success: {
      color: colors.success,
      marginTop: 10,
    },
  });
}

export default AddColor;
