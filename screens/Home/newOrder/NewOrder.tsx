import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, ScrollView, View } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import SelectedProductsDisplay from '../../../components/orders/SelectedProductsList';
import SortUserInformationField from '../../../components/orders/SortUserInformationField';
import ColorSizeSelectorsList from '../../../components/orders/ColorSizeSelectorsList';
import NewOrderPreview from '../../../components/orders/NewOrderPreview';
import CourierSelector from '../../../components/orders/CourierSelector';
import Button from '../../../util-components/Button';
import { Colors } from '../../../constants/colors';
import { addNewOrder } from '../../../util-methods/FetchMethods';
import { AuthContext } from '../../../store/auth-context';
import { popupMessage } from '../../../util-components/PopupMessage';
import { betterConsoleLog } from '../../../util-methods/LogMethods';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();
  const orderCtx = useContext(NewOrderContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  

  // ARTICLE LIST
  const [isArticleListOpen, setIsArticleListOpen] = useState(true);
  function handleArticleListOk(){
    setIsArticleListOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false);
    setIsCourierPreviewOpen(false);
    
    setTimeout(() => {
      setIsBuyerInfoOpen(true);
    }, 360)
  }

  // BUYER INFORMATION
  const [isBuyerInfoOpen, setIsBuyerInfoOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState('');

  function handleBuyerInfoOk(){
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsOrderPreviewOpen(false);
    setIsCourierPreviewOpen(false);

    setTimeout(() => {
      setIsColorSizeSelectorsOpen(true);
    }, 360)
  }

  // COLOR SIZES SELECTORS
  const [isColorSizeSelectorsOpen, setIsColorSizeSelectorsOpen] = useState(false);
  function handleColorSizeSelectorsOk(){
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false)
    
    setTimeout(() => {
      setIsCourierPreviewOpen(true);
    }, 360)
  }


  // COURIER SELECTOR
  const [isCourierPreviewOpen, setIsCourierPreviewOpen] = useState(false);
  function handleCourierSelectorOk(){
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false)
    setIsCourierPreviewOpen(false);
    
    setTimeout(() => {
      setIsOrderPreviewOpen(true);
    }, 360)
  }

  // ORDER PREVIEW SECTION
  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);

  // Reset order entries
  function handleResetOrderData(){
    setIsArticleListOpen(true);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsCourierPreviewOpen(false);
    setIsOrderPreviewOpen(false);

    // BUYER INFORMATION SECTION
    setBuyerInfo('');
    // ORDER PREVIEW SECTION
    orderCtx.setCustomPrice('');
    orderCtx.resetOrderData();
  }

  async function handleSubmitOrder(){
    try{
      // get order form with all the data from new-order-context
      const order = orderCtx.createOrderHandler()
      // betterConsoleLog('Logging out order form', order)
      if(order === undefined) return popupMessage('Order je undefined iz nekog razloga.','info');
  
      // Send the data via fetch
      if(!token) return popupMessage('Autentifikacioni token ne postoji!', 'danger');
      const response = await addNewOrder(order, token, 'orders');
  
      if(response){
        handleResetOrderData();
        popupMessage('Porudžbina uspešno dodata', 'success');
      } else {
        popupMessage('Došlo je do problema prilikom slanja nove porudžbine', 'danger');
      }
    } catch (error){
      console.error(error);
      popupMessage('Došlo je do problema prilikom slanja nove porudžbine', 'danger');
    }
  }
  
  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      </Animated.View>
      <Animated.ScrollView style={[styles.scrollViewContainer, { opacity: fadeAnimation }]}>
        <SelectedProductsDisplay
          setIsExpanded={setIsArticleListOpen}
          isExpanded={isArticleListOpen}
          onNext={handleArticleListOk}
          ordersCtx={orderCtx}
        />
        <SortUserInformationField
          setIsExpanded={setIsBuyerInfoOpen}
          isExpanded={isBuyerInfoOpen}
          onNext={handleBuyerInfoOk}
          buyerInfo={buyerInfo}
          setBuyerInfo={setBuyerInfo}
        />
        <ColorSizeSelectorsList
          ordersCtx={orderCtx}
          isExpanded={isColorSizeSelectorsOpen}
          setIsExpanded={setIsColorSizeSelectorsOpen}
          onNext={handleColorSizeSelectorsOk}
        />
        <CourierSelector
          isExpanded={isCourierPreviewOpen}
          setIsExpanded={setIsCourierPreviewOpen}
          onNext={handleCourierSelectorOk}
        />
        <NewOrderPreview
          isExpanded={isOrderPreviewOpen}
          setIsExpanded={setIsOrderPreviewOpen}
          customPrice={orderCtx.customPrice}
          setCustomPrice={orderCtx.setCustomPrice}
        />
        <View style={styles.buttonsContainer}>
          <Button
            backColor={Colors.secondaryDark}
            textColor={Colors.white}
            containerStyles={[styles.button, {marginBottom: 6}]}
            onPress={handleSubmitOrder}
          >
            Dodaj porudžbinu
          </Button>
          <Button
            backColor={Colors.error}
            textColor={Colors.white}
            containerStyles={[styles.button, {marginBottom: 6}]}
            onPress={handleResetOrderData}
          >
            Odustani i resetuj
          </Button>
        </View>
      </Animated.ScrollView>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  scrollViewContainer: {
    paddingHorizontal: 16
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
})

export default NewOrder