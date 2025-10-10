import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Animated as RNAnimated, StyleSheet, View } from 'react-native';
import SafeView from '../../components/layout/SafeView';
import OrdersStatisticsForDay from '../../components/statistics/OrdersStatisticsForDay';
import { Colors } from '../../constants/colors';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';
import { OrderStatisticsContext } from '../../store/end-of-day-statistics';

function PreviousStatisticFiles() {
  const fade = useFadeAnimation();
  const statsCtx = useContext(OrderStatisticsContext);
  const [statFiles, setStatFiles] = useState(statsCtx.statisticData);

  useEffect(() => {
    setStatFiles(statsCtx.statisticData);
  }, [statsCtx.statisticData]);

  return (
    <SafeView>
      <RNAnimated.View style={[styles.container, { opacity: fade }]}>
        <View style={styles.controllsContainer}>{/* Controls can go here */}</View>
        <View style={styles.statisticsContainer}>
          {statFiles.length > 0 ? (
            <FlatList
              data={statFiles}
              renderItem={({ item }) => <OrdersStatisticsForDay stats={item} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : null}
        </View>
      </RNAnimated.View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryDark,
    flex: 1,
  },
  controllsContainer: {},
  statisticsContainer: {},
  flatListContainer: {
    padding: 0,
    gap: 0,
    backgroundColor: Colors.primaryDark,
  },
});

export default PreviousStatisticFiles;
