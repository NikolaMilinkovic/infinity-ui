import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';
import InputField from '../../util-components/InputField';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface DropdownTypes {
  _id: string | number;
  name: string;
  value: string;
}
function AddCategories() {
  const authCtx = useContext(AuthContext);
  const { user } = useUser();
  const [inputText, setInputText] = useState<string>('');
  const [stockType, setStockType] = useState<DropdownTypes>({
    _id: 0,
    name: 'Veličina',
    value: 'Boja-Veličina-Količina',
  });
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([
    { _id: 0, name: 'Boja-Veličina-Količina', value: 'Boja-Veličina-Količina' },
    { _id: 1, name: 'Boja-Količina', value: 'Boja-Količina' },
  ]);
  const [error, setError] = useState<string>('');
  const colors = useThemeColors();
  const styles = getStyles(colors);

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
      setError('Kategorija mora imati ime!');
      popupMessage('Kategorija mora imati ime!', 'danger');
      return false;
    }
    if (!stockType || !stockType.name) {
      setError('Kategorija mora imati jedinicu lagera!');
      popupMessage('Kategorija mora jedinicu lagera!', 'danger');
      return false;
    }
    return true;
  }

  async function addCategoryHandler() {
    const validated = validateInput();
    if (!validated) return;
    if (!user?.permissions?.categories?.create)
      return popupMessage('Nemate permisiju za dodavanje nove kategorije.', 'danger');
    try {
      const newCategory = {
        name: inputText,
        stockType: stockType.value,
      };
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Kategorija ${newCategory.name} je uspesno dodata`, 'success');
      resetInputAndError();
    } catch (error) {
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja kategorije');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.controllsContainer}>
        {/* INPUT */}
        <View style={styles.inputContainer}>
          <InputField
            label="Unesi Kategoriju"
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
            background={colors.background}
            color={colors.defaultText}
            activeColor={colors.highlight}
            labelBorders={false}
            selectionColor={colors.highlight}
          />
        </View>
        {/* DROPDOWN */}
        <View style={styles.dropdownContainer}>
          <DropdownList
            data={dropdownData}
            defaultValue={'Boja-Veličina-Količina'}
            onSelect={setStockType}
            buttonContainerStyles={styles.dropdown}
          />
        </View>
      </View>

      {/* ERROR MESSAGE */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* BUTTON */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={addCategoryHandler}
          textColor={colors.whiteText}
          backColor={colors.buttonHighlight1}
          backColor1={colors.buttonHighlight2}
        >
          Sačuvaj
        </Button>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      borderColor: colors.borderColor,
      borderWidth: 0.5,
      paddingVertical: 16,
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
      flex: 1,
    },
    buttonContainer: {
      width: '100%',
      marginTop: 6,
      paddingHorizontal: 16,
    },
    error: {
      color: colors.error,
      marginTop: 10,
    },
    success: {
      color: colors.success1,
      marginTop: 10,
    },
    dropdownContainer: {
      flex: 1,
      elevation: 0,
    },
    dropdown: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      borderRadius: 4,
      height: 46,
    },
  });
}
export default AddCategories;
