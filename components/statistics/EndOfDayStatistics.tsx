import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { popupMessage } from '../../util-components/PopupMessage';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';
import { downloadAndShareFileViaLink } from '../../util-methods/FetchMethods';

function EndOfDayStatistics({ stats }) {

  return (
    <View style={styles.container}>
      <Button
        onPress={() => downloadAndShareFileViaLink(stats.fileName, stats.excellLink)}
        backColor={Colors.secondaryLight}
        textColor={Colors.primaryDark}
      >
        Prosledi Excell Fajl
      </Button>
      <View style={styles.labeledRow}>
        <Text style={styles.label}>Naziv fajla:</Text>
        <Text style={styles.info}>{stats.fileName}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  labeledRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  label: {
    flex: 2,
    fontWeight: 'bold',
  },
  info: {
    flex: 5
  }
})

export default EndOfDayStatistics