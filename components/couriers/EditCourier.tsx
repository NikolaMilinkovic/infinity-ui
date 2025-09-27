import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { CouriersContext } from '../../store/couriers-context';
import { CourierTypes } from '../../types/allTsTypes';
import EditCourierItem from './EditCourierItem';

function EditCourier() {
  const couriersCtx = useContext(CouriersContext);
  const [couriers, setCouriers] = useState<CourierTypes[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCouriers = async () => {
      setCouriers(couriersCtx.couriers);
      setIsLoading(false);
    };
    fetchCouriers();
  }, [couriersCtx]);

  // Filter couriers based on search query
  const filteredCouriers = useMemo(() => {
    if (!searchQuery.trim()) return couriers;
    return couriers.filter(
      (courier) =>
        courier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [couriers, searchQuery]);

  if (isLoading) {
    return <Text>Ucitavam kurire...</Text>;
  }

  function NoCouriersRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {},
    });

    return (
      <View style={internalStyle.container}>
        <Text style={internalStyle.text}>Trenutno ne postoje dodati kuriri</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {couriers.length > 0 ? (
        <>
          {/* Header and TextInput moved outside FlatList */}
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>Ukupno kurira: {couriers.length}</Text>
            <TextInput
              style={styles.input}
              placeholder="Pretraži kurire"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCouriers}
            keyExtractor={(item) => item._id}
            renderItem={(item) => <EditCourierItem data={item.item} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            initialNumToRender={10}
            removeClippedSubviews={false}
          />
        </>
      ) : (
        <NoCouriersRenderer />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.primaryLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
    gap: 2,
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 6,
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 0.5,
    elevation: 2,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: Colors.white,
    textAlign: 'center',
  },
  input: {
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 1,
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
    textAlignVertical: 'bottom',
  },
});

export default EditCourier;
