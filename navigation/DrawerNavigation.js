// navigation/DrawerNavigator.js

import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthenticatedTabs from './AuthenticatedTabs';
import Temp from '../screens/Temp';
import { Colors } from '../constants/colors';
import { useContext } from 'react';
import NavigationButton from '../util-components/NavigationButton';
import { AuthContext } from '../store/auth-context';

const Drawer = createDrawerNavigator();

/**
 * Handles display of icons / screens in the drawer menu
 */
export function CustomDrawerContent(props) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  function navigatePages(pageName){
    navigation.navigate(pageName)
  }

  return (
    <View style={{ flex: 1, paddingBottom: 60, paddingTop: 60 }}>
      <NavigationButton 
        icon="home" 
        onPress={() => navigatePages('Home')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Početna'
      />
      <NavigationButton 
        icon="user" 
        onPress={() => navigatePages('Profile')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Profil'
      />
      <NavigationButton 
        icon="setting" 
        onPress={() => navigatePages('Settings')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Podešavanja'
      />
      <NavigationButton 
        icon="profile" 
        onPress={() => navigatePages('UserManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Upravljanje Korisnicima'
      />
      <NavigationButton 
        icon="color-palette-outline" 
        onPress={() => navigatePages('ColorsManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Boje'
        type='Ionicon'
      />

      {/* Bottom Buttons */}
      <View style={{
        marginTop: 'auto'
      }}>
        <NavigationButton 
          icon="logout" 
          onPress={authCtx.logout} 
          size={18} 
          color={Colors.error}
          text='Logout'
        />
      </View>
    </View>
  );
}