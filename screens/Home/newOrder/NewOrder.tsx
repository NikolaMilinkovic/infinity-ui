import React, { useContext, useState } from 'react'
import { Animated, StyleSheet, ScrollView } from 'react-native'
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import { NewOrderContext } from '../../../store/new-order-context';
import SelectedProduct from '../../../components/orders/SelectedProduct';
import SelectedProductsDisplay from '../../../components/orders/SelectedProductsList';
import SortUserInformationField from '../../../components/orders/SortUserInformationField';

function NewOrder() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();
  const ordersCtx = useContext(NewOrderContext);

  // ARTICLE LIST
  const [isArticleListOpen, setIsArticleListOpen] = useState(true);
  function handleArticleListOk(){
    setIsArticleListOpen(false);
    setTimeout(() => {
      setIsBuyerInfoOpen(true);
    }, 360)
  }

  // BUYER INFORMATION
  const [isBuyerInfoOpen, setIsBuyerInfoOpen] = useState(false);
  function handleBuyerInfoOk(){
    setIsBuyerInfoOpen(false);
    setTimeout(() => {

    }, 360)
  }


  
  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <SelectedProductsDisplay
          setIsExpanded={setIsArticleListOpen}
          isExpanded={isArticleListOpen}
          onNext={handleArticleListOk}
          ordersCtx={ordersCtx}
        />
      </Animated.View>
      <Animated.ScrollView style={[styles.scrollViewContainer, { opacity: fadeAnimation }]}>
        <SortUserInformationField
          setIsExpanded={setIsBuyerInfoOpen}
          isExpanded={isBuyerInfoOpen}
          onNext={handleBuyerInfoOk}
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