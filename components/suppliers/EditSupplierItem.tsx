import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { Colors } from '../../constants/colors'
import Button from '../../util-components/Button'
import IconButton from '../../util-components/IconButton'
import { AuthContext } from '../../store/auth-context'
import { popupMessage } from '../../util-components/PopupMessage'
import { SupplierTypes } from '../../types/allTsTypes'
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function EditSupplierItem({ data }: { data: SupplierTypes }) {
  const [supplierData, setSupplierData] = useState<SupplierTypes>({
    _id: '',
    name: '',
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
  function showEditSupplierHandler(){
    setNewName(data.name)
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName)
  }

  // Set default data to read from
  useEffect(() => {
    setSupplierData(data);
    setNewName(data.name)
  }, [data])

  // Updates the current color name in the database
  async function updateSupplierHandler(){
    try{
      resetNotifications();
      if(newName.trim() === data.name){
        setShowEdit(false);
        return;
      }
      if(newName.trim() === ''){
        setError('Dobavljač mora imati ime!');
        popupMessage('Dobavljač mora imati ime', 'danger');
        return;
      }
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers/${supplierData._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: supplierData._id,
          name: newName,
        }),
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
      console.error('Error updating the supplier:', error);
    }
  }

  // Deletes the color from the database
  async function removeSupplierHandler(){
    setDisplay(false);
    try{
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers/${supplierData._id}`, {
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

      popupMessage(`Dobavljač je uspesno obrisan`, 'success');
    } catch(error){
      console.error('Error deleting supplier:', error);
    }
  }

  if(display === false){
    return;
  }

  if(supplierData === null){
    return (
      <></>
    )
  }

  return (
    <Pressable 
      style={styles.supplierItem}
      onPress={showEditSupplierHandler}
    >
      {showEdit ? (
        <View style={styles.mainInputsContainer}>
          <TextInput 
            style={styles.input}
            placeholder='Ime dobavljača'
            value={newName}
            onChangeText={handleNameChange}
          />
          <View style={styles.buttons}>
            <Button 
              onPress={showEditSupplierHandler}
              textColor={Colors.primaryLight}
              backColor={Colors.error}
            >Otkazi</Button>
            <Button 
              onPress={updateSupplierHandler}
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
        <View style={styles.displayItem}>
          <Text style={styles.supplierText}>{supplierData.name}</Text>
          <IconButton
            icon='delete'
            onPress={removeSupplierHandler}
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
  supplierItem: {
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
  displayItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  supplierText: {
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

export default EditSupplierItem