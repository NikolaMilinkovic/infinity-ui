import { MaterialIcons } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from 'react-native-reorderable-list';

interface CardProps {
  id: string;
  color: string;
  height: number;
}

const rand = () => Math.floor(Math.random() * 256);

const seedData: CardProps[] = Array(6)
  .fill(null)
  .map((_, i) => ({
    id: i.toString(),
    color: `rgb(${rand()}, ${rand()}, ${rand()})`,
    height: 80,
  }));

const Card: React.FC<CardProps> = memo(({ id, color, height }) => {
  const drag = useReorderableDrag();
  return (
    <Pressable onPressIn={drag}>
      <View style={[styles.card, { height }]}>
        <MaterialIcons name="drag-handle" size={24} color="#666" style={styles.icon} />
        <Text style={[styles.text, { color }]}>Card {id}</Text>
      </View>
    </Pressable>
  );
});

const Example = () => {
  const [data, setData] = useState(seedData);
  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setData((value) => reorderItems(value, from, to));
  };

  const renderItem = ({ item }: ListRenderItemInfo<CardProps>) => <Card {...item} />;

  return (
    <ReorderableList
      data={data}
      onReorder={handleReorder}
      renderItem={renderItem}
      // IMPORTANT: Do not use the current index as key.
      // Always use a stable and unique key for each item.
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 20,
  },
  icon: {
    marginRight: 10,
  },
});

export default Example;
