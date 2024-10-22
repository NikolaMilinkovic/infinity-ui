import React, { useContext, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { View, TextInput, Text, Animated } from 'react-native'
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import InputField from '../../util-components/InputField';
import { NewOrderContext } from '../../store/new-order-context';
import GalleryImagePicker from '../../util-components/GalleryImagePicker';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { handleBuyerDataInputSort } from '../../util-methods/InputSortMethods';

interface BuyerDataObjectTypes {
  name: string
  address: string
  phone: number
}
interface PropTypes {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onNext: () => void
  buyerInfo: string
  setBuyerInfo: (info: string) => void
}

function SortUserInformationField({isExpanded, setIsExpanded, onNext, buyerInfo, setBuyerInfo}: PropTypes) {
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const authCtx = useContext(AuthContext);
  const orderCtx = useContext(NewOrderContext)
  
  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(false);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 591, 180);

  function handleToggleExpand(){
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  // Sends buyer data for sorting and resets the input field
  async function handleInputSort(){
    const result = await handleBuyerDataInputSort(authCtx.token || '', buyerInfo, orderCtx.setBuyerData);
    if(result) setBuyerInfo('');
  }

  
  // ON NEXT
  function handleOnNext(){
    if(orderCtx.buyerData?.name && orderCtx.buyerData?.address && orderCtx.buyerData?.phone && orderCtx.profileImage){
      onNext()
    } else {
      if(!orderCtx.buyerData?.name) return popupMessage('Unesite ime / prezime kupca', 'danger');
      if(!orderCtx.buyerData?.address) return popupMessage('Unesite adresu kupca', 'danger');
      if(!orderCtx.buyerData?.phone) return popupMessage('Unesite broj telefona kupca', 'danger');
      if(!orderCtx.profileImage) return popupMessage('Unesite sliku profila kupca', 'danger');
    }
  }
  
  return (
    <View>
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Informacije o kupcu</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>


      {isContentVisible && (
        <Animated.View style={{height: toggleExpandAnimation, opacity: toggleFade, overflow: 'hidden', paddingHorizontal: 8}}>
          <GalleryImagePicker
            image={orderCtx.profileImage}
            setImage={orderCtx.setProfileImage}
          />
          <TextInput 
            style={styles.input}
            multiline={true}
            numberOfLines={6}
            onChangeText={setBuyerInfo}
            value={buyerInfo}
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
            inputText={orderCtx.buyerData?.name}
            setInputText={(text:(string | number | undefined)) => orderCtx.setBuyerData((prev) => ({ ...prev, name: text }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            label='Adresa'
            inputText={orderCtx.buyerData?.address}
            setInputText={(text:(string | number | undefined)) => orderCtx.setBuyerData((prev) => ({ ...prev, address: text }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            label='Broj telefona'
            inputText={orderCtx.buyerData?.phone}
            setInputText={(text:(string | number | undefined)) => orderCtx.setBuyerData((prev) => ({ ...prev, phone: Number(text) }))}
            labelBorders={false}
            containerStyles={styles.inputFieldStyle}
            keyboard='numeric'
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
    maxHeight: 135,
  },
  sortButton: {
    marginBottom: 5
  },
  inputFieldStyle: {
    marginVertical: 8
  }
})

export default SortUserInformationField