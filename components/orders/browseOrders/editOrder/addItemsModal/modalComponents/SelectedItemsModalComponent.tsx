import React from 'react'
import { ScrollView, ScrollViewBase, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Colors } from '../../../../../../constants/colors'
import Animated from 'react-native-reanimated'
import SelectedItem from './SelectedItem'
import ColorSizeStockSelectorModalComponent from './ColorSizeStockSelectorModalComponent'

function SelectedItemsModalComponent({ selectedItems, setSelectedItems }: any) {
  return (
    <TouchableWithoutFeedback>
      <ScrollView style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={{marginHorizontal: 8}}>

            <Text style={styles.header}>Izabrani artikli</Text>
            {/* LIST */}
            <Animated.FlatList 
              style={styles.listContainer}
              data={selectedItems}
              renderItem={({item, index}) => (          
                  <SelectedItem 
                    item={item}
                    setSelectedItems={setSelectedItems}
                    index={index}
                  />
              )}
              keyExtractor={(item, index) => `${index}-${item._id}`}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
            <Text style={styles.header}>Boje | Veličine</Text>
            <Animated.FlatList 
              style={styles.colorSizePickers}
              data={selectedItems}
              renderItem={({item, index}) => (          
                <ColorSizeStockSelectorModalComponent
                  product={item}
                  setSelectedItems={setSelectedItems}
                  index={index}
                />
              )}
              keyExtractor={(item, index) => `${index}-${item._id}`}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 8
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryDark
  },
  listContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    marginBottom: 6,
    minHeight: 250,
  },
  colorSizePickers:{
    marginBottom: 6,
    minHeight: 250,
  }
})

export default SelectedItemsModalComponent