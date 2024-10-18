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

interface PropTypes{
  ordersCtx: NewOrderContextTypes
  isExpanded: boolean
  onNext: () => void
  setIsExpanded: (expanded: boolean) => void
}
function SelectedProductsDisplay({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  const fadeAnimation = useToggleFadeAnimation(isExpanded, 180);
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 10 : 250)).current;
  const [isContentVisible, setIsContentVisible] = useState(true);

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
      toValue: isExpanded ? 250 : 10,
      duration: 180,
      useNativeDriver: false,
    }).start(() => {
      if(!isExpanded) {
        setIsContentVisible(false);
      }
    });
  }, [isExpanded]);

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