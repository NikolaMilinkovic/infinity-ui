import React, { useState } from 'react'
import { Animated } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';

function BrowseProductsComponent(){
  const [productName, setProductName] = useState('test');

  return (
    <Animated.View>
      <InputField
        label='Naziv Proizvoda'
        isSecure={false}
        inputText={productName}
        setInputText={setProductName}
        background={Colors.primaryLight}
        color={Colors.primaryDark}
        activeColor={Colors.secondaryDark}
      />
    </Animated.View>
  )
}

export default BrowseProductsComponent