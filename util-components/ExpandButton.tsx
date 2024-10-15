import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';

interface PropTypes {
  isExpanded: boolean
  handleToggleExpand: () => void
  containerStyles?: StyleProp<ViewStyle>
  iconStyles?: StyleProp<ViewStyle>
  size?: number
}

function ExpandButton({ isExpanded, handleToggleExpand, containerStyles, iconStyles, size=24 }: PropTypes) {

  return (
    <Pressable style={[styles.pressable, containerStyles]} onPress={handleToggleExpand}>
      <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={iconStyles} size={size}/>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  }
});

export default ExpandButton