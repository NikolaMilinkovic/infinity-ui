import React, { useContext, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { View, TextInput, Text, Animated } from 'react-native'
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import InputField from '../../util-components/InputField';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import { NewOrderContext } from '../../store/new-order-context';

interface PropTypes {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onNext: () => void
}

function SortUserInformationField({isExpanded, setIsExpanded, onNext}: PropTypes) {
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 10 : 428)).current;
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const authCtx = useContext(AuthContext);
  const orderCtx = useContext(NewOrderContext)

  const [buyerDataObject, setBuyerDataObject] = useState({
    name: '',
    address: '',
    phone: '',
  })

  useEffect(() => {
    if(isExpanded){
      setIsContentVisible(true)
    }
  }, [isExpanded])

  function handleToggleExpand(){
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsContentVisible(true);
      setIsExpanded(true);
    }
  }
  // EXPAND ANIMATION
  useEffect(() => {
    Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? 428 : 10,
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      if(!isExpanded) {
        setIsContentVisible(false);
      }
    });
  }, [isExpanded]);

  async function handleInputSort(){
    if(inputValue.trim() === ''){
      popupMessage('Morate uneti podatke o kupcu','danger')
      return;
    }
    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/orders/parse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData: inputValue })
      })

      // Handle errors
      if (!response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }
      const parsedResponse = await response.json();
      setBuyerDataObject({
        name: parsedResponse.data.name,
        address: parsedResponse.data.address,
        phone: parsedResponse.data.phone,
      });
      popupMessage(parsedResponse.message, 'success')
    } catch(error){
      console.error(error);
      throw new Error('Došlo je do problema prilikom dodavanja kategorije');
    }
  }

  
  // ON NEXT
  function handleOnNext(){
    if(buyerDataObject.name && buyerDataObject.address && buyerDataObject.phone){
      onNext()
    } else {
      if(!buyerDataObject.name) return popupMessage('Unesite ime / prezime kupca', 'danger');
      if(!buyerDataObject.address) return popupMessage('Unesite adresu kupca', 'danger');
      if(!buyerDataObject.phone) return popupMessage('Unesite broj telefona kupca', 'danger');
    }
  }
  useEffect(() => {
    orderCtx.setBuyerData(buyerDataObject);
  }, [buyerDataObject])
  
  return (
    <View>
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Informacije o kupcu</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>


      {isContentVisible && (
        <Animated.View style={{height: toggleExpandAnimation, opacity: toggleFade, overflow: 'hidden', paddingHorizontal: 8}}>
          <TextInput 
            style={styles.input}
            multiline={true}
            numberOfLines={6}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Unesite puno ime, adresu i broj telefona kupca"
            textAlignVertical="top"
          />

          <Button
            textColor={Colors.primaryDark}
            backColor={Colors.secondaryLight}
            onPress={handleInputSort}
            containerStyles={styles.sortButton}
          >
            Sortiraj podatke
          </Button>
          <InputField
            label='Ime i Prezime'
            inputText={buyerDataObject.name}
            setInputText={(text) => setBuyerDataObject((prev) => ({ ...prev, name: text }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            label='Adresa'
            inputText={buyerDataObject.address}
            setInputText={(text) => setBuyerDataObject((prev) => ({ ...prev, address: text }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            label='Broj telefona'
            inputText={buyerDataObject.phone}
            setInputText={(text) => setBuyerDataObject((prev) => ({ ...prev, phone: text }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
          />
          <Button
            backColor={Colors.highlight}
            textColor={Colors.white}
            containerStyles={{marginBottom: 6}}
            onPress={handleOnNext}
          >
            Dalje
          </Button>
        </Animated.View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    // paddingBottom: 16
  },
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row'
  },
  iconStyle: {
    marginLeft:'auto'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: Colors.primaryDark,
    marginBottom: 6,
    padding: 10,
    fontSize: 16,
    maxHeight: 140,
  },
  sortButton: {
    marginBottom: 5
  },
  inputFieldStyle: {
    marginVertical: 8
  }
})

export default SortUserInformationField