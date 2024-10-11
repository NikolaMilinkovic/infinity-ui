import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import InputField from '../../util-components/InputField'

interface SearchProductsPropTypes {
  searchData: string
  setSearchData: string
}
function SearchProducts({ searchData, setSearchData }: SearchProductsPropTypes) {
  return (
    <View>
      <InputField
        label='Pretraži proizvode'
        isSecure={false}
        inputText={searchData}
        setInputText={setSearchData}
        containerStyles={styles.inputField}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputField: {
    marginTop: 18
  }
})

export default SearchProducts