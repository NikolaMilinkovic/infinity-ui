import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { Colors } from '../../constants/colors'
import Button from '../../util-components/Button'
import IconButton from '../../util-components/IconButton'
import { AuthContext } from '../../store/auth-context'
import { popupMessage } from '../../util-components/PopupMessage'
import { ColorType } from '../../types/allTsTypes'

function EditColorItem({ data }: { data: ColorType }) {
  const [colorData, setColorData] = useState<ColorType>({
    _id: '',
    name: '',
    colorCode: ''
  });
  const [newName, setNewName] = useState('')
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);

  // Resets Error & Success 
  function resetNotifications(){
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditColorHandler(){
    setNewName(data.name)
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName)
  }

  // Set default data to read from
  useEffect(() => {
    setColorData(data);
    setNewName(data.name)
  }, [data])

  // Updates the current color name in the database
  async function updateColorHandler(){
    try{
      resetNotifications();
      if(newName.trim() === data.name){
        setShowEdit(false);
        return;
      }
      if(newName.trim() === ''){
        setError('Boja mora imati ime!');
        popupMessage('Boja mora imati ime', 'danger');
        return;
      }
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/colors/${colorData._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: colorData._id,
          name: newName,
          colorCode: colorData.colorCode
        })
      })

      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
      }

      const parsedResponse = await response.json();
      setSucces(parsedResponse.message);
      popupMessage(parsedResponse.message, 'success');
      setShowEdit(false);
    } catch(error){
      console.error('Error updating the color:', error);
    }
  }

  // Deletes the color from the database
  async function removeColorHandler(){
    setDisplay(false);
    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/colors/${colorData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const parsedResponse = await response.json();
        setDisplay(true);
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Boja je uspesno obrisana`, 'success');
    } catch(error){
      console.error('Error deleting color:', error);
    }
  }

  if(display === false){
    return;
  }

  if(colorData === null){
    return (
      <></>
    )
  }

  return (
    <Pressable 
      style={styles.colorItem}
      onPress={showEditColorHandler}
    >
      {showEdit ? (
        <View style={styles.mainInputsContainer}>
          <TextInput 
            style={styles.input}
            placeholder='Ime boje'
            value={newName}
            onChangeText={handleNameChange}
          />
          <View style={styles.buttons}>
            <Button 
              onPress={showEditColorHandler}
              textColor={Colors.primaryLight}
              backColor={Colors.error}
            >Otkazi</Button>
            <Button 
              onPress={updateColorHandler}
              textColor={Colors.primaryLight}
              backColor={Colors.primaryDark}
            >Sacuvaj</Button>
          </View>
          {error && (
            <Text style={styles.error}>{error}</Text>
          )}
          {success && (
            <Text style={styles.success}>{success}</Text>
          )}
        </View>
      ) : (
        <View style={styles.displayColor}>
          <Text style={styles.colorText}>{colorData.name}</Text>
          <IconButton
            icon='delete'
            onPress={removeColorHandler}
            color={Colors.error}
            style={styles.deleteIcon}
            size={26}
          />
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  colorItem: {
    padding: 14,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  deleteIcon: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
  },
  displayColor: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  colorText: {
    fontSize: 16,
  },
  mainInputsContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  input: {
    borderBottomColor: Colors.primaryDark,
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: 10, 
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    maxWidth: '50%',
    justifyContent: 'space-between',
    gap: 10,
  },
  error: {
    marginTop: 8,
    color: Colors.error,
    textAlign: 'center',
  },
  success: {
    marginTop: 8,
    color: Colors.success,
    textAlign: 'center'
  }
})

export default EditColorItem