import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Animated as RNAnimated } from 'react-native';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import { OrderStatisticsContext } from '../../store/end-of-day-statistics';
import OrdersStatisticsForDay from '../../components/statistics/OrdersStatisticsForDay';
import { Colors } from '../../constants/colors';

function PreviousStatisticFiles() {
  const fade = useFadeAnimation();
  const statsCtx = useContext(OrderStatisticsContext);
  const [statFiles, setStatFiles] = useState(statsCtx.statisticData);

  useEffect(() => {
    setStatFiles(statsCtx.statisticData);
  }, [statsCtx.statisticData]);

  return (
    <RNAnimated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.controllsContainer}>
        {/* Controls can go here */}
      </View>
      <View style={styles.statisticsContainer}>
        {statFiles.length > 0 ? (
          <FlatList
            data={statFiles}
            renderItem={({ item }) => (
              <OrdersStatisticsForDay stats={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          // <Text>Ne postoji</Text>
          null
        )}
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  controllsContainer: {
  },
  statisticsContainer: {
  },
  flatListContainer: {
    padding: 0, 
    gap: 0,
    backgroundColor: Colors.primaryDark
  },
});

export default PreviousStatisticFiles;
