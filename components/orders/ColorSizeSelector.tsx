import React from 'react'
import { NewOrderContextTypes } from '../../types/allTsTypes'
import { View } from 'react-native'

interface PropTypes {
  ordersCtx: NewOrderContextTypes
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onNext: () => void
}
function ColorSizeSelector({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  
  return (
    <View>

    </View>
  )
}

export default ColorSizeSelector