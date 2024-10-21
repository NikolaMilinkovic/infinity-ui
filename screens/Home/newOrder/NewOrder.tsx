import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, ScrollView } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import SelectedProductsDisplay from '../../../components/orders/SelectedProductsList';
import SortUserInformationField from '../../../components/orders/SortUserInformationField';
import ColorSizeSelectorsList from '../../../components/orders/ColorSizeSelectorsList';
import NewOrderPreview from '../../../components/orders/NewOrderPreview';
import CourierSelector from '../../../components/orders/CourierSelector';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();
  const ordersCtx = useContext(NewOrderContext);
  

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
  const [buyerDataObject, setBuyerDataObject] = useState({
    name: '',
    address: '',
    phone: '',
  })
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

  useEffect(() => {
    console.log(isCourierPreviewOpen)
  },[isCourierPreviewOpen])

  // ORDER PREVIEW SECTION
  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  function handleSubmitOrder(){

  }

  // Reset order entries
  function resetOrderData(){
    setIsArticleListOpen(true);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsCourierPreviewOpen(false);
    setIsOrderPreviewOpen(false);

    // BUYER INFORMATION SECTION
    setBuyerInfo('');
    setBuyerDataObject({
      name: '',
      address: '',
      phone: '',
    });
    // ORDER PREVIEW SECTION
    setCustomPrice('');
    ordersCtx.setIsReservation(false);
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
            ordersCtx={ordersCtx}
          />
        <SortUserInformationField
          setIsExpanded={setIsBuyerInfoOpen}
          isExpanded={isBuyerInfoOpen}
          onNext={handleBuyerInfoOk}
          buyerInfo={buyerInfo}
          setBuyerInfo={setBuyerInfo}
          buyerDataObject={buyerDataObject}
          setBuyerDataObject={setBuyerDataObject}
        />
        <ColorSizeSelectorsList
          ordersCtx={ordersCtx}
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
          ordersCtx={ordersCtx}
          isExpanded={isOrderPreviewOpen}
          setIsExpanded={setIsOrderPreviewOpen}
          onReset={resetOrderData}
          customPrice={customPrice}
          setCustomPrice={setCustomPrice}
        />
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
  }
})

export default NewOrder