import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../store/auth-context';
import InputField from '../../util-components/InputField';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import { popupMessage } from '../../util-components/PopupMessage';

function AddColor() {
  const authCtx = useContext(AuthContext);
  const [inputText, setInputText] = useState<string>('')
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
      setError('Boja mora imati ime!');
      popupMessage('Boja mora imati ime!', 'danger');
      return false;
    }
    return true;
  }

  async function addColorHandler(){
    const validated = validateInput();
    if(!validated) return;

    try{
      const newColor = {
        name: inputText,
        colorCode: ''
      };
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/colors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ color: newColor })
      })

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`${newColor.name} boja je uspesno dodata`, 'success');
      resetInputAndError();
    } catch(error){

      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja boje');
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.controllsContainer}>
        <View style={styles.inputContainer}>
          <InputField 
            label='Unesi Boju'
            isSecure={false}
            inputText={inputText}
            setInputText={setInputText}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
              onPress={addColorHandler}
              textColor={Colors.whiteText}
              backColor={Colors.highlight}
          >
            Sačuvaj
          </Button>
        </View>
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.primaryDark,
    borderWidth: 0.5,
    paddingVertical: 16,
    backgroundColor: Colors.whiteText
  },
  controllsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flex: 0.6
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
  }
})

export default AddColor