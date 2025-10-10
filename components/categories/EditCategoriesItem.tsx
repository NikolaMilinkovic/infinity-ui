import Constants from 'expo-constants';
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { useConfirmationModal } from '../../store/modals/confirmation-modal-context';
import { useUser } from '../../store/user-context';
import { CategoryTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface DropdownTypes {
  _id: string | number;
  name: string;
  value: string;
}

function EditCategoriesItem({ data }: { data: CategoryTypes }) {
  const [categoryData, setCategoryData] = useState<CategoryTypes>({
    _id: '',
    name: '',
    stockType: '',
  });
  const [newName, setNewName] = useState('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const user = useUser();
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);
  const [stockType, setStockType] = useState<DropdownTypes | undefined>();
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([
    { _id: 0, name: 'Veličina', value: 'Boja-Veličina-Količina' },
    { _id: 1, name: 'Boja', value: 'Boja-Količina' },
  ]);

  // Resets Error & Success
  function resetNotifications() {
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditCategoryrHandler() {
    setNewName(data.name);
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName);
  }

  // Set default data to read from
  useEffect(() => {
    setCategoryData(data);
    setNewName(data.name);
    // setStockType(data.stockType);
  }, [data]);

  // Updates the current category name in the database
  async function updateCategoryHandler() {
    if (!user?.permissions?.categories?.update)
      return popupMessage('Nemate permisiju za ažuriranje kategorija.', 'danger');
    try {
      resetNotifications();
      // if(newName.trim() === data.name){
      //   setShowEdit(false);
      //   return;
      // }
      if (newName.trim() === '') {
        setError('Kategorija mora imati ime!');
        popupMessage('Kategorija mora imati ime', 'danger');
        return;
      }
      if (!stockType) {
        setError('Kategorija mora imati jedinicu lagera!');
        popupMessage('Kategorija mora imati jedinicu lagera', 'danger');
        return;
      }
      const response = await fetch(
        `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories/${categoryData._id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: categoryData._id,
            name: newName,
            stockType: stockType.value,
          }),
        }
      );

      if (!response.ok) {
        const parsedResponse = await response.json();
        setError(parsedResponse.message);
        popupMessage(parsedResponse.message, 'danger');
      }

      const parsedResponse = await response.json();
      setSucces(parsedResponse.message);
      popupMessage(parsedResponse.message, 'success');
      setShowEdit(false);
    } catch (error) {
      console.error('Error updating the category:', error);
    }
  }

  // Deletes the category from the database
  const { showConfirmation } = useConfirmationModal();
  async function removeCategoryHandler() {
    if (!user?.permissions?.categories?.delete) {
      return popupMessage('Nemate permisiju za brisanje kategorija.', 'danger');
    }
    showConfirmation(
      async () => {
        try {
          setDisplay(false);
          const response = await fetch(
            `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories/${categoryData._id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${authCtx.token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            const parsedResponse = await response.json();
            setDisplay(true);
            setError(parsedResponse.message);
            popupMessage(parsedResponse.message, 'danger');
            return;
          }

          popupMessage(`Kategorija je uspešno obrisana`, 'success');
        } catch (error) {
          popupMessage('Došlo je do problema prilikom brisanja kategorije.', 'danger');
          console.error('Error deleting category:', error);
        }
      },
      `Da li sigurno želite da obrišete kategoriju ${categoryData.name}?`,
      () => {}
    );
  }

  // Expand
  const [contentHeight, setContentHeight] = useState(0);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(
    showEdit as boolean,
    setShowEdit,
    40,
    contentHeight,
    280
  );

  if (display === false) {
    return;
  }

  if (categoryData === null) {
    return <></>;
  }

  return (
    <Pressable style={styles.colorItem} onPress={showEditCategoryrHandler}>
      <Animated.ScrollView
        style={{ height: toggleExpandAnimation }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {showEdit ? (
          <View
            style={styles.mainInputsContainer}
            onLayout={(e) => {
              setContentHeight(e.nativeEvent.layout.height);
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="Ime kategorije"
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
              >
                Otkaži
              </Button>
              <Button
                containerStyles={styles.buttonStyle}
                onPress={updateCategoryHandler}
                textColor={Colors.primaryLight}
                backColor={Colors.primaryDark}
              >
                Sačuvaj
              </Button>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
          </View>
        ) : (
          <View style={styles.displayCategory}>
            <View style={styles.categoryData}>
              <Text style={[styles.text, styles.categoryName]}>{categoryData.name}</Text>
              <Text style={styles.text}>{data.stockType}</Text>
            </View>
            <IconButton
              icon="delete"
              onPress={removeCategoryHandler}
              color={Colors.error}
              style={styles.deleteIcon}
              size={26}
            />
          </View>
        )}
      </Animated.ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  colorItem: {
    padding: 14,
    paddingHorizontal: 25,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    backgroundColor: 'white',
    marginBottom: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    elevation: 1,
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
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: 10,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    maxWidth: 200,
    alignSelf: 'flex-end',
  },
  error: {
    marginTop: 8,
    color: Colors.error,
    textAlign: 'center',
  },
  success: {
    marginTop: 8,
    color: Colors.success,
    textAlign: 'center',
  },
  buttonStyle: {
    flex: 1,
  },
});

export default EditCategoriesItem;
