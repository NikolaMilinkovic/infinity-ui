import React, { useContext, useState } from 'react'
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
  const [customPrice, setCustomPrice] = useState();
  const [showEdit, setShowEdit] = useState(false);
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

          {/* BUYER INFORMATION */}
          <View style={styles.buyerInfoContainer}>
            <Text style={styles.header2}>Informacije o kupcu</Text>

            {/* NAME */}
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Ime:</Text>
              <Text style={styles.information}>{orderCtx.buyerData?.name || 'N/A'}</Text>
            </View>

            {/* ADDRESS */}
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Adresa:</Text>
              <Text style={styles.information}>{orderCtx.buyerData?.address || 'N/A'}</Text>
            </View>

            {/* PHONE */}
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Telefon:</Text>
              <Text style={styles.information}>{orderCtx.buyerData?.phone || 'N/A'}</Text>
            </View>

          </View>

          {/* SELECTED PRODUCTS */}
          <View style={styles.selectedItemsContainer}>
            <Text style={styles.header2}>Izabrani proizvodi ({orderCtx.productData.length}) :</Text>
            {orderCtx?.productData.map((item, index) => (
              <View 
                style={[
                  styles.selectedItem, 
                  index === orderCtx.productData.length - 1 ? styles.lastItemStyle : null,
                ]}
                key={index}
                
                >
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Artikal:</Text>
                  <Text style={styles.information}>{item.itemReference.name || 'N/A'}</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Kategorija:</Text>
                  <Text style={styles.information}>{item.itemReference.category || 'N/A'}</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Boja:</Text>
                  <Text style={styles.information}>{item.selectedColor || 'N/A'}</Text>
                </View>
                {item.hasOwnProperty('selectedSize') && (
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>Veličina:</Text>
                    <Text style={styles.information}>{item.selectedSize || 'N/A'}</Text>
                  </View>
                )}
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>Cena:</Text>
                    <Text style={styles.information}>{`${item.itemReference.price} din` || 'N/A'}</Text>
                  </View>
              </View>
            ))}

          </View>

          <View style={styles.otherInfoContainer}>
            {/* EDIT FIELDS BUTTON */}
            <Pressable onPress={() => setShowEdit(!showEdit)} style={styles.editButton}>
              <Icon name={showEdit ? 'file-edit-outline' : 'cancel'} style={styles.editIcon} size={28} color={Colors.primaryDark}/>
            </Pressable>

            <Text style={styles.header2}>Ostale informacije:</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Ukupna cena:</Text>
              <Text style={styles.information}>{orderCtx.productData.map((item) => item.itemReference.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0)} din</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Kurir:</Text>
              <Text style={styles.information}></Text>
            </View>
          </View>
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
  buyerInfoContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
  },
  header2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    marginLeft: 8
  },
  label: {
    flex: 2,
  },
  information: {
    flex: 3,
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
  },
  selectedItemsContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
    paddingBottom: 0,
  },
  selectedItem: {
    borderBottomWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    paddingVertical: 8,
  },
  lastItemStyle: {
    borderBottomWidth: 0
  },
  otherInfoContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    zIndex: 1
  },
  editIcon: {

  }
})

export default NewOrderPreview