import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { Colors } from '../../constants/colors'
import Button from '../../util-components/Button'
import IconButton from '../../util-components/IconButton'
import { AuthContext } from '../../store/auth-context'
import { popupMessage } from '../../util-components/PopupMessage'
import { CategoryTypes } from '../../types/allTsTypes'
import DropdownList from '../../util-components/DropdownList'
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface DropdownTypes {
  _id: string | number
  name: string
  value: string
}

function EditCategoriesItem({ data }: { data: CategoryTypes }) {
  const [categoryData, setCategoryData] = useState<CategoryTypes>({
    _id: '',
    name: '',
    stockType: '',
  });
  const [newName, setNewName] = useState('')
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);
  const [stockType, setStockType] = useState<DropdownTypes | undefined>()
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([
    {_id: 0, name: 'Veličina', value: 'Boja-Veličina-Količina'},
    {_id: 1, name: 'Boja', value: 'Boja-Količina'},
  ]);

  // Resets Error & Success 
  function resetNotifications(){
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditCategoryrHandler(){
    setNewName(data.name)
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName)
  }

  // Set default data to read from
  useEffect(() => {
    setCategoryData(data);
    setNewName(data.name);
    // setStockType(data.stockType);
  }, [data])

  // Updates the current category name in the database
  async function updateCategoryHandler(){
    try{
      resetNotifications();
      // if(newName.trim() === data.name){
      //   setShowEdit(false);
      //   return;
      // }
      if(newName.trim() === ''){
        setError('Kategorija mora imati ime!');
        popupMessage('Kategorija mora imati ime', 'danger');
        return;
      }
      if(!stockType){
        setError('Kategorija mora imati jedinicu lagera!');
        popupMessage('Kategorija mora imati jedinicu lagera', 'danger');
        return;
      }
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories/${categoryData._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: categoryData._id,
          name: newName,
          stockType: stockType.value
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
      console.error('Error updating the category:', error);
    }
  }

  // Deletes the category from the database
  async function removeCategoryHandler(){
    setDisplay(false);
    try{
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories/${categoryData._id}`, {
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

      popupMessage(`Kategorija je uspesno obrisana`, 'success');
    } catch(error){
      console.error('Error deleting category:', error);
    }
  }

  if(display === false){
    return;
  }

  if(categoryData === null){
    return (
      <></>
    )
  }

  // function getStockTypeName(){
  //   if(data.stockType === 'Boja-Veličina-Količina') return 'Veličina';
  //   if(data.stockType === 'Boja-Količina') return 'Količina';
  //   return '';
  // }
  return (
    <Pressable 
      style={styles.colorItem}
      onPress={showEditCategoryrHandler}
    >
      {showEdit ? (
        <View style={styles.mainInputsContainer}>
          <TextInput 
            style={styles.input}
            placeholder='Ime kategorije'
            value={newName}
            onChangeText={handleNameChange}
          />
          <DropdownList
            data={dropdownData}
            defaultValue={data.stockType}
            onSelect={setStockType}
            buttonContainerStyles={styles.dropdown}
          />
          <View style={styles.buttons}>
            <Button 
              containerStyles={styles.buttonStyle}
              onPress={showEditCategoryrHandler}
              textColor={Colors.primaryLight}
              backColor={Colors.error}
            >Otkazi</Button>
            <Button 
              containerStyles={styles.buttonStyle}
              onPress={updateCategoryHandler}
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
        <View style={styles.displayCategory}>
          <View style={styles.categoryData}>
              <Text style={[styles.text, styles.categoryName]}>{categoryData.name}</Text>
              <Text style={styles.text}>{data.stockType}</Text>
          </View>
          <IconButton
            icon='delete'
            onPress={removeCategoryHandler}
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
  displayCategory: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  categoryData: {
    flexDirection: 'column',
    width: '100%'
  },
  text: {
    fontSize: 14,
  },
  categoryName: {
    fontWeight: 'bold',
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
  dropdown: {
    marginBottom: 8
  },
  buttons: {
    flexDirection: 'row',
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
  },
  buttonStyle: {
    flex: 1
  }
})

export default EditCategoriesItem