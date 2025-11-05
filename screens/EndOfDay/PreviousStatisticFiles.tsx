import { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/layout/Card';
import OrdersStatisticsForDay from '../../components/statistics/OrdersStatisticsForDay';
import { OrderStatisticsContext } from '../../store/end-of-day-statistics';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

function PreviousStatisticFiles() {
  const statsCtx = useContext(OrderStatisticsContext);
  const [statFiles, setStatFiles] = useState(statsCtx.statisticData);
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    setStatFiles(statsCtx.statisticData);
  }, [statsCtx.statisticData]);

  return (
    <ScrollView style={styles.statisticsContainer}>
      <Card padding={0} cardStyles={styles.card}>
        {statFiles.length > 0 ? (
          <FlatList
            data={statFiles}
            renderItem={({ item }) => <OrdersStatisticsForDay stats={item} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={5}
            initialNumToRender={2}
          />
        ) : null}
      </Card>
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    controllsContainer: {},
    statisticsContainer: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
    flatListContainer: {
      padding: 0,
      gap: 0,
      paddingBottom: 16,
      flex: 1,
    },
    card: {
      flex: 1,
      marginBottom: 50,
    },
  });
}

export default PreviousStatisticFiles;
