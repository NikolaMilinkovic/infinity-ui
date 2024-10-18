import React, { useContext, useState } from 'react'
import { Animated, StyleSheet, ScrollView } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import SelectedProductsDisplay from '../../../components/orders/SelectedProductsList';
import SortUserInformationField from '../../../components/orders/SortUserInformationField';
import ColorSizeSelectorsList from '../../../components/orders/ColorSizeSelectorsList';
import NewOrderPreview from '../../../components/orders/NewOrderPreview';

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
    
    setTimeout(() => {
      setIsBuyerInfoOpen(true);
    }, 360)
  }

  // BUYER INFORMATION
  const [isBuyerInfoOpen, setIsBuyerInfoOpen] = useState(false);
  function handleBuyerInfoOk(){
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsOrderPreviewOpen(false);

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
    
    setTimeout(() => {
      setIsOrderPreviewOpen(true);
    }, 360)
  }

  // ORDER PREVIEW
  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);
  function handleSubmitOrder(){

  }

  // Reset order entries
  function resetOrderData(){
    setIsArticleListOpen(true);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false);
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
        />
        <ColorSizeSelectorsList
          ordersCtx={ordersCtx}
          isExpanded={isColorSizeSelectorsOpen}
          setIsExpanded={setIsColorSizeSelectorsOpen}
          onNext={handleColorSizeSelectorsOk}
        />
        <NewOrderPreview
          ordersCtx={ordersCtx}
          isExpanded={isOrderPreviewOpen}
          setIsExpanded={setIsOrderPreviewOpen}
          onReset={resetOrderData}
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