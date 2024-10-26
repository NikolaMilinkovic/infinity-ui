import React, { useContext, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import IconButton from '../../util-components/IconButton'
import { Colors } from '../../constants/colors'
import { useExpandAnimation, useExpandAnimationWithContentVisibility } from '../../hooks/useExpand'
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation'
import { AuthContext } from '../../store/auth-context'
import { popupMessage } from '../../util-components/PopupMessage'


interface PropTypes {
  active: boolean
  onRemoveBatchPress: () => void
}
function BatchModeControlls({ active, onRemoveBatchPress }:PropTypes) {
  useEffect(() => {
    setIsExpanded(active);
  }, [active])
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 70, 100);



  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          <IconButton
            size={26}
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
  },
  removeBatchItemsButton: {
    margin: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  removeBatchItemsButtonPressed: {
    opacity: 0.7,
    elevation: 1,
  },
})

export default BatchModeControlls