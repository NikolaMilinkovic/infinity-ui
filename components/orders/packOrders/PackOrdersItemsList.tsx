import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { OrderTypes } from '../../../types/allTsTypes';
import PackOrderItem from './PackOrderItem';

interface selectedCourier {
  name: string;
  stockType: string;
}
interface PackOrderItemsListPropTypes {
  selectedCourier: selectedCourier | null;
  data: OrderTypes[];
}
function PackOrdersItemsList({ selectedCourier, data }: PackOrderItemsListPropTypes) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => (
        <Pressable delayLongPress={200}>
          <PackOrderItem order={item} />
        </Pressable>
      )}
      style={styles.list}
      contentContainerStyle={styles.listContainer}
      initialNumToRender={10}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    gap: 8,
    paddingBottom: 16,
  },
  list: {
    paddingTop: 8,
  },
});
export default PackOrdersItemsList;
