import { createDrawerNavigator } from '@react-navigation/drawer';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import { useContext } from 'react';
import NavigationButton from '../util-components/NavigationButton';
import { AuthContext } from '../store/auth-context';

const Drawer = createDrawerNavigator();

/**
 * Handles display of icons / screens in the drawer menu
 * Buttons inside the drawer navigation, handles displaying the screens
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
        icon="addusergroup" 
        onPress={() => navigatePages('UserManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Upravljanje Korisnicima'
      />

      {/* COLORS | CATEGORIES */}
      <NavigationButton 
        icon="color-palette-outline" 
        onPress={() => navigatePages('ColorsCategoriesTabs')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Boje i Kategorije'
        type='Ionicons'
      />

      {/* PRODUCTS MANAGER */}
      <NavigationButton 
        icon="profile" 
        onPress={() => navigatePages('ProductsManager')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Upravljanje Proizvodima'
      />

      {/* SETTINGS */}
      <NavigationButton 
        icon="setting" 
        onPress={() => navigatePages('Settings')} 
        size={18} 
        color={Colors.secondaryDark}
        text='Podešavanja'
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