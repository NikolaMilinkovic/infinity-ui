import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LogContext } from '../../store/log-context';

function LoadingLogDisplay() {
  const { startupLogs } = useContext(LogContext);
  const styles = getStyles();
  return (
    <View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {Object.entries(startupLogs).map(([key, value]) => (
          <Text key={key}>{value.text}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles() {
  return StyleSheet.create({
    wrapper: {
      marginTop: 50,
      display: 'flex',
      alignItems: 'center',
      height: 140,
    },
  });
}

export default LoadingLogDisplay;
