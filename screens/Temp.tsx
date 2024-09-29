import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../util-components/Button'
import { AuthContext } from '../store/auth-context'
import { useContext } from 'react'

function Temp() {
  const authCtx = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text>This is the authenticated temp screen</Text>
      <Button
        onPress={authCtx.logout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})

export default Temp