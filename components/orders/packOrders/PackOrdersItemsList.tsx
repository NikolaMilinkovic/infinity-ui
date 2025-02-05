import React, { useContext, useEffect, useState } from 'react'
import { OrdersContext } from '../../../store/orders-context'
import { FlatList, Pressable, StyleSheet} from 'react-native';
import PackOrderItem from './PackOrderItem';
import { CourierTypes, OrderTypes } from '../../../types/allTsTypes';
import { Colors } from '../../../constants/colors';

interface selectedCourier {
  name: string;
  stockType: string;
}
interface PackOrderItemsListPropTypes {
  selectedCourier: selectedCourier | null
  data: OrderTypes[]
}
function PackOrdersItemsList({ selectedCourier, data }: PackOrderItemsListPropTypes) {

  return (
    <FlatList 
    data={data} 
    keyExtractor={(item) => item._id} 
    renderItem={({item, index}) => 
      <Pressable
        delayLongPress={100}
      >
        <PackOrderItem 
          order={item} 
        />
      </Pressable>
    }
    style={styles.list}
    contentContainerStyle={styles.listContainer}
    initialNumToRender={10}
  />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    gap: 8,
  },
  list: {
    paddingTop: 8,
  },
})
export default PackOrdersItemsList