import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { useConfirmationModal } from '../../store/modals/confirmation-modal-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import { ColorTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function EditColorItem({ data }: { data: ColorTypes }) {
  const [colorData, setColorData] = useState<ColorTypes>({
    _id: '',
    boutiqueId: '',
    name: '',
    colorCode: '',
  });
  const [newName, setNewName] = useState('');
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user } = useUser();

  // Resets Error & Success
  function resetNotifications() {
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditColorHandler() {
    setNewName(data.name);
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName);
  }

  // Set default data to read from
  useEffect(() => {
    setColorData(data);
    setNewName(data.name);
  }, [data]);

  // Updates the current color name in the database
  async function updateColorHandler() {
    try {
      if (!user?.permissions?.colors?.update) {
        return popupMessage('Nemate permisiju za ažuriranje boja.', 'danger');
      }
      resetNotifications();
      if (newName.trim() === data.name) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        setError('Boja mora imati ime!');
        popupMessage('Boja mora imati ime', 'danger');
        return;
      }
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/colors/${colorData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: colorData._id,
          name: newName,
          colorCode: colorData.colorCode,
        }),
      });

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
      console.error('Error updating the color:', error);
    }
  }

  const { showConfirmation } = useConfirmationModal();

  // Deletes the color from the database
  async function removeColorHandler() {
    if (!user?.permissions?.colors?.delete) {
      return popupMessage('Nemate permisiju za brisanje boja.', 'danger');
    }
    showConfirmation(
      async () => {
        try {
          setDisplay(false);
          const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/colors/${colorData._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const parsedResponse = await response.json();
            setDisplay(true);
            setError(parsedResponse.message);
            popupMessage(parsedResponse.message, 'danger');
            return;
          }

          popupMessage(`Boja je uspešno obrisana`, 'success');
        } catch (error) {
          popupMessage('Došlo je do problema prilikom brisanja boje.', 'danger');
          console.error('Error deleting color:', error);
        }
      },
      `Da li sigurno želite da obrišete ${colorData.name} boju?`,
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

  if (colorData === null) {
    return <></>;
  }

  return (
    <Pressable style={styles.colorItem} onPress={showEditColorHandler}>
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
              style={[styles.input, { color: colors.defaultText }]}
              placeholderTextColor={colors.grayText}
              placeholder="Ime boje"
              value={newName}
              onChangeText={handleNameChange}
              selectionColor={colors.highlight}
            />
            <View style={styles.buttons}>
              <Button
                onPress={showEditColorHandler}
                textColor={colors.defaultText}
                backColor={colors.buttonNormal1}
                backColor1={colors.buttonNormal2}
                containerStyles={styles.buttonStyle}
              >
                Otkaži
              </Button>
              <Button
                onPress={updateColorHandler}
                textColor={colors.whiteText}
                backColor={colors.buttonHighlight1}
                backColor1={colors.buttonHighlight2}
                containerStyles={styles.buttonStyle}
              >
                Sačuvaj
              </Button>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
          </View>
        ) : (
          <View style={styles.displayColor}>
            <Text style={styles.colorText}>{colorData.name}</Text>
            <IconButton
              icon="delete"
              onPress={removeColorHandler}
              color={colors.error}
              style={styles.deleteIcon}
              size={26}
              backColor="transparent"
              backColor1="transparent"
              pressedStyles={styles.buttonContainerPressed}
            />
          </View>
        )}
      </Animated.ScrollView>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    colorItem: {
      padding: 14,
      paddingHorizontal: 25,
      backgroundColor: colors.background,
      marginBottom: 2,
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
    },
    deleteIcon: {
      minHeight: 30,
      backgroundColor: colors.background,
    },
    displayColor: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    colorText: {
      fontSize: 16,
      color: colors.defaultText,
      marginRight: 'auto',
    },
    mainInputsContainer: {
      width: '100%',
      flexDirection: 'column',
    },
    input: {
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
      flex: 1,
      marginBottom: 10,
      marginTop: 10,
      fontSize: 16,
      paddingVertical: 10,
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

export default EditColorItem;
