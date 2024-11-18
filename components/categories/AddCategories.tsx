import React, { useContext, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import { popupMessage } from '../../util-components/PopupMessage';
import DropdownList from '../../util-components/DropdownList';
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface DropdownTypes {
  _id: string | number
  name: string
}
function AddCategories() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('')
  const [stockType, setStockType] = useState<DropdownTypes>({_id: 0, name: 'Boja-Veličina-Količina'})
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([
    {_id: 0, name: 'Boja-Veličina-Količina'},
    {_id: 1, name: 'Boja-Količina'}
  ]);
  const [error, setError] = useState<string>('')
  
  function resetInputAndError(){
    setInputText('');
    setError('');
  }
  function resetError(){
    setError('');
  }
  function validateInput(){
    resetError()
    if(inputText.trim() === ''){
      setError('Kategorija mora imati ime!');
      popupMessage('Kategorija mora imati ime!', 'danger');
      return false;
    }
    if(!stockType || !stockType.name){
      setError('Kategorija mora imati jedinicu lagera!');
      popupMessage('Kategorija mora jedinicu lagera!', 'danger');
      return false;
    }
    return true;
  }

  async function addCategoryHandler(){
    const validated = validateInput();
    if(!validated) return;

    try{
      const newCategory = {
        name: inputText,
        stockType: stockType.name
      };
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory })
      })

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Kategorija ${newCategory.name} je uspesno dodata`, 'success');
      resetInputAndError();
    } catch(error){

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
            label='Unesi Kategoriju'
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
            background={Colors.primaryLight}
            color={Colors.primaryDark}
            activeColor={Colors.secondaryDark}
            labelBorders={false}
          />
        </View>
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

        {/* ERROR MESSAGE */}
        {error && (
        <Text style={styles.error}>{error}</Text>
        )}

        {/* BUTTON */}
        <View style={styles.buttonContainer}>
          <Button 
              onPress={addCategoryHandler}
              textColor={Colors.whiteText}
              backColor={Colors.highlight}
          >
            Sačuvaj
          </Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.primaryDark,
    borderWidth: 0.5,
    paddingVertical: 16,
    backgroundColor: Colors.primaryLight
  },
  controllsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    paddingHorizontal: 16,
  },
  inputContainer: {
    width: '100%'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  error: {
    color: Colors.error,
    marginTop: 10,
  },
  success: {
    color: Colors.success,
    marginTop: 10,
  },
  dropdownContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: 'transparent'
  }
})

export default AddCategories