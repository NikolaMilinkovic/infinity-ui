import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGlobalStyles } from '../../../constants/globalStyles';
import useAuthToken from '../../../hooks/useAuthToken';
import { useBoutiques } from '../../../store/superAdmin/boutiques-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import Button from '../../../util-components/Button';
import InputField from '../../../util-components/InputField';
import { popupMessage } from '../../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function AddBoutique() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [error, setError] = useState('');
  const { user } = useUser();
  const { boutiques } = useBoutiques();
  const token = useAuthToken();
  const globalStyles = useGlobalStyles();
  const [boutiqueData, setBoutiqueData] = useState({
    boutiqueName: '',
  });

  function resetInputAndError() {
    setBoutiqueData({
      boutiqueName: '',
    });
    setError('');
  }
  function resetError() {
    setError('');
  }
  function validateInput() {
    resetError();
    if (boutiqueData.boutiqueName.trim() === '') {
      setError('Butik mora imati ime!');
      popupMessage('Butik mora imati ime!', 'danger');
      return false;
    }
    return true;
  }

  async function addBoutiqueHandler() {
    if (!user?.permissions?.boutiques?.create) {
      return popupMessage('Nemate permisiju za dodavanje butika.', 'danger');
    }
    const validated = validateInput();
    if (!validated) return;

    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/admin/add-boutique`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boutiqueData }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Butik ${boutiqueData.boutiqueName} uspešno dodat`, 'success');
      resetInputAndError();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja butika');
    }
  }

  return (
    <View style={[styles.container, globalStyles.elevation_2]}>
      <View style={styles.controllsContainer}>
        <View style={styles.inputContainer}>
          <InputField
            label="Unesi novi butik"
            background={colors.background}
            color={colors.defaultText}
            activeColor={colors.highlight}
            labelBorders={false}
            inputText={boutiqueData.boutiqueName}
            selectionColor={colors.highlight}
            setInputText={(text) =>
              setBoutiqueData((prev) => ({
                ...prev,
                boutiqueName: text,
              }))
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={addBoutiqueHandler}
            textColor={colors.whiteText}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
          >
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
      borderColor: colors.borderColor,
      borderWidth: 0,
      paddingVertical: 20,
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

export default AddBoutique;
