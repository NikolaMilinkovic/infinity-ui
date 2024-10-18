import React, { useContext } from 'react'
import { NewOrderContextTypes } from '../../types/allTsTypes'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { NewOrderContext } from '../../store/new-order-context';
import Button from '../../util-components/Button';
import { popupMessage } from '../../util-components/PopupMessage';


interface PropTypes {
  ordersCtx: NewOrderContextTypes
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onReset: () => void
}


function NewOrderPreview({ ordersCtx, isExpanded, setIsExpanded, onReset }: PropTypes) {
  const orderCtx = useContext(NewOrderContext)
  function handleToggleExpand(){
    setIsExpanded(!isExpanded)
  }

  function handleSubmitOrder(){
    popupMessage('> Porudžbina upsešno dodata', 'success');
    orderCtx.resetOrderData();
    onReset();
  }
  function handleResetOrderData(){
    orderCtx.resetOrderData();
    onReset();
  }
  
  return (
    <Animated.ScrollView>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Pregled nove porudžbine</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>
      
      {isExpanded &&(
        <View style={styles.container}>
          <Text>Ime: {orderCtx.buyerData?.name || 'N/A'}</Text>
          <Text>Adresa: {orderCtx.buyerData?.address || 'N/A'}</Text>
          <Text>Telefon: {orderCtx.buyerData?.phone || 'N/A'}</Text>
          {orderCtx?.productData.map((item) => (
            <Text>1x - {item.itemReference.name || 'N/A'}, Boja: {item.selectedColor || 'N/A'}, Veličina: {item.selectedSize || 'N/A'}</Text>
          ))}
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <Button
          backColor={Colors.secondaryLight}
          textColor={Colors.white}
          containerStyles={[styles.button, {marginBottom: 6}]}
          onPress={handleSubmitOrder}
        >
          Dodaj porudžbinu
        </Button>
        <Button
          backColor={Colors.secondaryLight}
          textColor={Colors.white}
          containerStyles={[styles.button, {marginBottom: 6}]}
          onPress={handleResetOrderData}
        >
          Resetuj sve podatke
        </Button>
      </View>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8
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
  buttonsContainer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10
  },
  button: {
    flex: 2,
  }
})

export default NewOrderPreview