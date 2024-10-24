import React from 'react'
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, Platform  } from 'react-native';
import { Colors } from '../constants/colors';

interface ButtonChildrenTypes {
  onPress: () => void
  icon: string | undefined
  color: string | undefined
  size: number | undefined
  text: string | undefined
  type: 'Ant' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons'
}
const NavigationButton: React.FC<ButtonChildrenTypes> = ({ onPress, icon, color, size=20, text, type='Ant' }) => {
  const styles = getStyles(size, color);
  let Icon:any;

  if(type === 'Ant'){
    Icon = <AntDesign name={icon} color={color} size={size + 6}/>;
  }
  if(type === 'Ionicons'){
    Icon = <Ionicons name={icon} color={color} size={size + 6}/>;
  }
  if(type === 'MaterialIcons'){
    Icon = <MaterialIcons name={icon} color={color} size={size + 6}/>;
  }
  if(type === 'MaterialCommunityIcons'){
    Icon = <MaterialCommunityIcons name={icon} color={color} size={size + 6}/>;
  }
  

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      android_ripple={{ color: Colors.secondaryLight }}  
    >
      <View style={styles.container}>
        {Icon}
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  )
}

function getStyles(size:number|undefined, color:string|undefined){
  return (
    StyleSheet.create({
      pressable: {
        padding: 10,
        paddingLeft: 36
      },
      pressed: {
        opacity: Platform.OS === 'ios' ? 0.7 : 1,
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20
      },
      text: {
        fontSize: size,
        color: color,
      }
    })
  )
}

export default NavigationButton