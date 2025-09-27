import Constants from 'expo-constants';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { AuthContext } from '../../store/auth-context';
import { useUser } from '../../store/user-context';
import { CourierTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import IconButton from '../../util-components/IconButton';
import { popupMessage } from '../../util-components/PopupMessage';
const backendURI = Constants.expoConfig?.extra?.backendURI;

function EditCourierItem({ data }: { data: CourierTypes }) {
  const [courierData, setCourierData] = useState<CourierTypes>({
    _id: '',
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
  const user = useUser();

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
  async function removeCourierHandler() {
    if (!user?.permissions?.couriers?.delete) {
      return popupMessage('Nemate permisiju za brisanje kurira.', 'danger');
    }
    setDisplay(false);
    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/couriers/${courierData._id}`, {
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

      popupMessage(`Kurir je uspešno obrisan`, 'success');
    } catch (error) {
      console.error('Error deleting courier:', error);
    }
  }

  if (display === false) {
    return;
  }

  if (courierData === null) {
    return <></>;
  }

  return (
    <Pressable style={styles.courierItem} onPress={showEditCourierHandler}>
      {showEdit ? (
        <View style={styles.mainInputsContainer}>
          <TextInput style={styles.input} placeholder="Ime kurira" value={newName} onChangeText={handleNameChange} />
          <TextInput
            style={styles.input}
            placeholder="Cena dostave po paketu"
            value={deliveryPrice?.toString() || ''}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />
          <View style={styles.buttons}>
            <Button onPress={showEditCourierHandler} textColor={Colors.primaryLight} backColor={Colors.error}>
              Otkaži
            </Button>
            <Button onPress={updateCourierHandler} textColor={Colors.primaryLight} backColor={Colors.primaryDark}>
              Sačuvaj
            </Button>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          {success && <Text style={styles.success}>{success}</Text>}
        </View>
      ) : (
        <View style={styles.displayCourier}>
          <View style={styles.previewData}>
            <Text style={styles.text}>{courierData.name}</Text>
            <Text style={styles.price}>Cena dostave: {courierData.deliveryPrice} RSD</Text>
          </View>
          <IconButton
            icon="delete"
            onPress={removeCourierHandler}
            color={Colors.error}
            style={styles.deleteIcon}
            size={26}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  courierItem: {
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
  displayCourier: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  previewData: {},
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
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
    textAlign: 'center',
  },
});

export default EditCourierItem;
