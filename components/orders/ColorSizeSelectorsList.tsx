import React, { useEffect, useRef, useState } from 'react'
import { NewOrderContextTypes } from '../../types/allTsTypes'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import ColorSizeSelector from './ColorSizeSelector'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import Button from '../../util-components/Button';
import { popupMessage } from '../../util-components/PopupMessage';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/reanimated2/component/ScrollView';
import { betterConsoleLog } from '../../util-methods/LogMethods';

interface PropTypes {
  ordersCtx: NewOrderContextTypes
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onNext: () => void
}
function ColorSizeSelectorsList({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 0 : 128)).current;
  const [isContentVisible, setIsContentVisible] = useState(false);

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
      toValue: isExpanded ? 128 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      if(!isExpanded) {
        setIsContentVisible(false);
      }
    });
  }, [isExpanded]);

  function handleOnNext(){
    if(ordersCtx.productData.length === 0) return popupMessage('Morate izabrati proizvod kako bi nastavili dalje', 'danger');
    const missingColor = ordersCtx.productData.some((order) => order.selectedColor === '');
    if(missingColor) return popupMessage('Morate izabrati boju za svaki proizvod', 'danger');


    const productsWithSizes = ordersCtx.productData.filter(product => product.hasOwnProperty('selectedSize'));
    betterConsoleLog('> Products with sizes', productsWithSizes);
    const missingSize = productsWithSizes.some((order) => order.selectedSize === '');
    if(missingSize) return popupMessage('Morate uneti veličinu za svaki proizvod', 'danger');

    onNext();
  }

  return (
    <Animated.ScrollView>

      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Boje i Veličine</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>

      {/* MAIN */}
      {isExpanded && (
        <Animated.ScrollView style={styles.container}>
          {ordersCtx.productData.map((product, index) => (
              <Animated.View style={{ paddingHorizontal: 8}} key={`${index}-${product._id}`}>
                <ColorSizeSelector
                  index={index}
                  product={product}
                  context={ordersCtx}
                />
              </Animated.View>
          ))}

          {/* ON NEXT BUTTON */}
          <Button
            backColor={Colors.highlight}
            textColor={Colors.white}
            containerStyles={{marginBottom: 6, marginHorizontal: 8}}
            onPress={handleOnNext}
          >
            Dalje
          </Button>
        </Animated.ScrollView>
      )}
    </Animated.ScrollView>
  )
}


const styles = StyleSheet.create({
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
  container: {
    paddingHorizontal: 8,
  }
})

export default ColorSizeSelectorsList