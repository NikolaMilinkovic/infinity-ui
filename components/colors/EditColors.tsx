import React, { useEffect, useState, useContext } from 'react'
import { ColorsContext } from '../../store/colors-context';
import { View, StyleSheet, Text, FlatList } from 'react-native'
import EditColorItem from './EditColorItem';
import { Colors } from '../../constants/colors';

function EditColors() {
  const colorsCtx = useContext(ColorsContext);
  
  interface ColorType {
    _id: string
    name: string
    colorCode: string
  }
  
  const [colors, setColors] = useState<ColorType[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchColors = async () => {
      const ctxColors = colorsCtx.getColors();
      setColors(ctxColors);
      setIsLoading(false);
    };
    fetchColors();
  }, [colorsCtx])

  if (isLoading) {
    return <Text>Ucitavam boje...</Text>;
  }

  function NoColorRenderer(){
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      text: {
        
      }
    })

    return (
      <View style={internalStyle.container}>
        <Text style={internalStyle.text}>
          Trenutno ne postoje dodate boje
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {colors.length > 0 ? (
        <FlatList 
          data={colors} 
          keyExtractor={(item) => item._id} 
          renderItem={(item) => <EditColorItem data={item.item}/>}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => <Text style={styles.header}>Lista Boja</Text>}
          initialNumToRender={10}
          removeClippedSubviews={false}
        />
      ) : (
        <NoColorRenderer/>
      )}
    </View>
  )
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
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'white',
  }
})

export default EditColors