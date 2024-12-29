import React, { useContext, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import IconButton from '../../util-components/IconButton'
import { Colors } from '../../constants/colors'
import { useExpandAnimation, useExpandAnimationWithContentVisibility } from '../../hooks/useExpand'
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation'
import { AuthContext } from '../../store/auth-context'
import { popupMessage } from '../../util-components/PopupMessage'
import Button from '../../util-components/Button'


interface PropTypes {
  active: boolean
  onRemoveBatchPress: () => void
  handleSortProducts: (position: string) => void
}
function BatchModeControlls({ active, onRemoveBatchPress, handleSortProducts }:PropTypes) {
  useEffect(() => {
    setIsExpanded(active);
  }, [active])
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 60, 100);

  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>

          {/* Product sorting buttons */}
          <View style={styles.sortProductsContainer}>
            <Button containerStyles={styles.button} onPress={() => handleSortProducts('top')}>
              Top
            </Button>
            <Button containerStyles={styles.button} onPress={() => handleSortProducts('mid')}>
              Mid
            </Button>
            <Button containerStyles={styles.button} onPress={() => handleSortProducts('bot')}>
              Bot
            </Button>
          </View>

          {/* DELETE button */}
          <IconButton
            size={22}
            color={Colors.highlight}
            onPress={onRemoveBatchPress}
            key={`key-remove-batch-button`}
            icon='delete'
            style={styles.removeBatchItemsButton} 
            pressedStyles={styles.removeBatchItemsButtonPressed}
          />
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primaryDark,
    flexDirection: 'row',
  },
  removeBatchItemsButton: {
    margin: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  removeBatchItemsButtonPressed: {
    opacity: 0.7,
    elevation: 1,
  },
  sortProductsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    flex: 1,
    maxWidth: 60,
    height: 40,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 0,
    marginRight: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
  }
})

export default BatchModeControlls