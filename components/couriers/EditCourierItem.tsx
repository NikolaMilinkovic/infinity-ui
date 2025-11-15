import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { useConfirmationModal } from '../../store/modals/confirmation-modal-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import { CourierTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import CustomText from '../../util-components/CustomText';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function EditCourierItem({ data }: { data: CourierTypes }) {
  const globalStyles = useGlobalStyles();
  const [courierData, setCourierData] = useState<CourierTypes>({
    _id: '',
    boutiqueId: '',
    name: '',
    deliveryPrice: 0,
  });
  const [newName, setNewName] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState<number>();
  const [showEdit, setShowEdit] = useState<Boolean>(false);
  const authCtx = useContext(AuthContext);
  const [success, setSucces] = useState('');
  const [error, setError] = useState('');
  const [display, setDisplay] = useState(true);
  const { user } = useUser();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Resets Error & Success
  function resetNotifications() {
    setSucces('');
    setError('');
  }

  // Toggler
  function showEditCourierHandler() {
    setNewName(data.name);
    setDeliveryPrice(data.deliveryPrice);
    setShowEdit(!showEdit);
  }

  // On input text change
  function handleNameChange(newName: string) {
    setNewName(newName);
  }
  function handlePriceChange(newPrice: string) {
    const price = newPrice.replace(/[^0-9.]/g, '');
    setDeliveryPrice(Number(price));
  }

  // Set default data to read from
  useEffect(() => {
    setCourierData(data);
    setNewName(data.name);
    setDeliveryPrice(data.deliveryPrice);
  }, [data]);

  // Updates the current color name in the database
  async function updateCourierHandler() {
    try {
      if (!user?.permissions?.couriers?.update) {
        return popupMessage('Nemate permisiju za ažuriranje kurira.', 'danger');
      }
      resetNotifications();
      if (newName.trim() === data.name && deliveryPrice === data.deliveryPrice) {
        setShowEdit(false);
        return;
      }
      if (newName.trim() === '') {
        setError('Kurir mora imati ime!');
        popupMessage('Kurir mora imati ime', 'danger');
        return;
      }
      if (!deliveryPrice) {
        setError('Kurir mora imati cenu dostave!');
        popupMessage('Kurir mora cenu dostave', 'danger');
        return;
      }
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/couriers/${courierData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: courierData._id,
          name: newName,
          deliveryPrice: deliveryPrice,
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
      console.error('Error updating the courier:', error);
    }
  }

  // Deletes the color from the database
  const { showConfirmation } = useConfirmationModal();
  async function removeCourierHandler() {
    if (!user?.permissions?.couriers?.delete) {
      return popupMessage('Nemate permisiju za brisanje kurira.', 'danger');
    }
    showConfirmation(
      async () => {
        try {
          setDisplay(false);
          const response = await fetch(
            `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/couriers/${courierData._id}`,
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

          popupMessage(`Kurir je uspešno obrisan`, 'success');
        } catch (error) {
          popupMessage('Došlo je do problema prilikom brisanja kurira.', 'danger');
          console.error('Error deleting courier:', error);
        }
      },
      `Da li sigurno želite da obrišete kurira ${courierData.name}?`,
      () => {}
    );
  }

  const [contentHeight, setContentHeight] = useState(0);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(
    showEdit as boolean,
    setShowEdit,
    44,
    contentHeight,
    280
  );

  if (display === false) {
    return;
  }

  if (courierData === null) {
    return <></>;
  }

  return (
    <Pressable style={styles.courierItem} onPress={showEditCourierHandler}>
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
              style={[styles.input, globalStyles.textRegular]}
              placeholder="Ime kurira"
              value={newName}
              onChangeText={handleNameChange}
              selectionColor={colors.highlight}
              placeholderTextColor={colors.grayText}
            />
            <TextInput
              style={[styles.input, globalStyles.textRegular]}
              placeholder="Cena dostave po paketu"
              value={deliveryPrice?.toString() || ''}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              selectionColor={colors.highlight}
              placeholderTextColor={colors.grayText}
            />
            <View style={styles.buttons}>
              <Button
                onPress={showEditCourierHandler}
                textColor={colors.defaultText}
                backColor={colors.buttonNormal1}
                backColor1={colors.buttonNormal2}
                containerStyles={styles.buttonStyle}
              >
                Otkaži
              </Button>
              <Button
                onPress={updateCourierHandler}
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
          <View style={styles.displayCourier}>
            <View style={styles.previewData}>
              <CustomText variant="bold" style={styles.text}>
                Kurir: {courierData.name}
              </CustomText>
              <CustomText style={styles.price}>Cena dostave: {courierData.deliveryPrice} RSD</CustomText>
            </View>
            <IconButton
              icon="delete"
              onPress={removeCourierHandler}
              color={colors.error}
              style={styles.deleteIcon}
              size={26}
              backColor="transparent"
              backColor1="transparent"
            />
          </View>
        )}
      </Animated.ScrollView>
    </Pressable>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    courierItem: {
      padding: 14,
      paddingHorizontal: 25,
      backgroundColor: colors.background,
      marginBottom: 1,
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
    },
    deleteIcon: {
      marginLeft: 'auto',
      paddingHorizontal: 8,
    },
    displayCourier: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    previewData: {
      color: colors.defaultText,
    },
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
    price: {
      fontSize: 13,
      color: colors.defaultText,
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
      fontSize: 16,
      color: colors.defaultText,
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
      minHeight: 0,
      height: 36,
    },
  });
}
export default EditCourierItem;
