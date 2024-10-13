import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'
function DisplayProduct({ item }) {
  return (
    <View key={item._id} style={styles.container}>
      <Image resizeMode="contain" source={{ uri: item.image.uri }} style={styles.image}/>
      <View style={styles.infoContainer}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Price: ${item.price}</Text>
        <Text>Status: {item.active ? "Active" : "Inactive"}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    height: 120,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: Colors.highlight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.white,
    marginBottom: 4,
    elevation: 2
  },
  image: {
    height: '100%',
    flex: 4
  },
  infoContainer: {
    flex: 8
  }
})

export default DisplayProduct