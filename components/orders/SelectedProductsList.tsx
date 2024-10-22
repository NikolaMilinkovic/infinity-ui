import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, FlatList, Pressable, Animated } from 'react-native'
import SelectedProduct from './SelectedProduct'
import { ScrollView } from 'react-native-gesture-handler'
import { Colors } from '../../constants/colors'
import { NewOrderContextTypes } from '../../types/allTsTypes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation'
import Button from '../../util-components/Button'
import { popupMessage } from '../../util-components/PopupMessage'
import { useExpandAnimation, useExpandAnimationWithContentVisibility } from '../../hooks/useExpand'

interface PropTypes{
  ordersCtx: NewOrderContextTypes
  isExpanded: boolean
  onNext: () => void
  setIsExpanded: (expanded: boolean) => void
}
function SelectedProductsDisplay({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  const fadeAnimation = useToggleFadeAnimation(isExpanded, 180);

  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(true);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 250)

  function handleToggleExpand(){
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }


  // ON NEXT
  function handleOnNext(){
    if(ordersCtx.productReferences.length > 0){
      onNext()
    } else {
      popupMessage('Molimo izaberite proizvod', 'danger')
    }
  }

  return (
    <View style={styles.container}>

      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Izabrani artikli</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>

      {/* MAIN */}
      {isContentVisible && (
        <View style={{marginHorizontal: 8}}>

          {/* LIST */}
          <Animated.FlatList 
            style={[styles.listContainer, {height: toggleExpandAnimation, opacity: fadeAnimation}]}
            data={ordersCtx.productReferences}
            renderItem={({item, index}) => (          
                <SelectedProduct 
                  item={item}
                  orderCtx={ordersCtx}
                  index={index}
                />
            )}
            keyExtractor={(item, index) => `${index}-${item._id}`}
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          {/* NEXT BUTTON */}
          <Button
            backColor={Colors.highlight}
            textColor={Colors.white}
            containerStyles={{marginBottom: 6}}
            onPress={handleOnNext}
          >
            Dalje
          </Button>
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {

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
  listContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    marginBottom: 6
  }
})

export default SelectedProductsDisplay