import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { useConfirmationModal } from '../../store/modals/confirmation-modal-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import { SupplierTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function EditSupplierItem({ data }: { data: SupplierTypes }) {
  const [supplierData, setSupplierData] = useState<SupplierTypes>({
    _id: '',
    boutiqueId: '',
    name: '',
  });
  const [newName, setNewName] = useState('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);
  const user = useUser();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Resets Error & Success
  function resetNotifications() {
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditSupplierHandler() {
    setNewName(data.name);
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName);
  }

  // Set default data to read from
  useEffect(() => {
    setSupplierData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateSupplierHandler() {
    try {
      if (!user?.permissions?.suppliers?.update) {
        return popupMessage('Nemate dozvolu za ažuriranje dobavljača', 'danger');
      }
      resetNotifications();
      if (newName.trim() === data.name) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        setError('Dobavljač mora imati ime!');
        popupMessage('Dobavljač mora imati ime', 'danger');
        return;
      }
      const response = await fetch(
        `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers/${supplierData._id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: supplierData._id,
            name: newName,
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
      console.error('Error updating the supplier:', error);
    }
  }

  // Deletes the color from the database
  const { showConfirmation } = useConfirmationModal();
  async function removeSupplierHandler() {
    if (!user?.permissions?.suppliers?.delete) {
      return popupMessage('Nemate dozvolu za brisanje dobavljača', 'danger');
    }

    showConfirmation(
      async () => {
        setDisplay(false);
        try {
          const response = await fetch(
            `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers/${supplierData._id}`,
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

          popupMessage(`Dobavljač je uspešno obrisan`, 'success');
        } catch (error) {
          popupMessage('Došlo je do problema prilikom brisanja dobavljača.', 'danger');
          console.error('Error deleting supplier:', error);
        }
      },
      `Da li sigurno želite da obrišete dobavljača ${supplierData.name}?`,
      () => {}
    );
  }

  const [contentHeight, setContentHeight] = useState(0);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(
    showEdit as boolean,
    setShowEdit,
    28,
    contentHeight,
    280
  );

  if (display === false) {
    return;
  }

  if (supplierData === null) {
    return <></>;
  }

  return (
    <Pressable style={styles.supplierItem} onPress={showEditSupplierHandler}>
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
              placeholder="Ime dobavljača"
              value={newName}
              onChangeText={handleNameChange}
            />
            <View style={styles.buttons}>
              <Button
                onPress={showEditSupplierHandler}
                textColor={colors.primaryLight}
                backColor={colors.error}
                containerStyles={styles.buttonStyle}
              >
                Otkaži
              </Button>
              <Button
                onPress={updateSupplierHandler}
                textColor={colors.primaryLight}
                backColor={colors.primaryDark}
                containerStyles={styles.buttonStyle}
              >
                Sačuvaj
              </Button>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
          </View>
        ) : (
          <View style={styles.displayItem}>
            <Text style={styles.supplierText}>{supplierData.name}</Text>
            <IconButton
              icon="delete"
              onPress={removeSupplierHandler}
              color={colors.error}
              style={styles.deleteIcon}
              size={26}
            />
          </View>
        )}
      </Animated.ScrollView>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    supplierItem: {
      padding: 14,
      paddingHorizontal: 25,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor: 'white',
      marginBottom: 1,
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
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
      borderBottomColor: colors.secondaryLight,
      borderBottomWidth: 1,
      flex: 1,
      marginBottom: 10,
      fontSize: 16,
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
      color: colors.error,
      textAlign: 'center',
    },
    success: {
      marginTop: 8,
      color: colors.success,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
    },
  });
}

export default EditSupplierItem;
