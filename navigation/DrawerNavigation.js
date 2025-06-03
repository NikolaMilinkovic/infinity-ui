import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
// import { Colors } from '../constants/colors';
import { useContext, useState } from 'react';
import { useGetAppColors } from '../constants/useGetAppColors';
import { AuthContext } from '../store/auth-context';
import { UserContext } from '../store/user-context';
import NavigationButton from '../util-components/NavigationButton';

const Drawer = createDrawerNavigator();

/**
 * Handles display of icons / screens in the drawer menu
 * Buttons inside the drawer navigation, handles displaying the screens
 */
export function CustomDrawerContent(props) {
  const [isActive, setIsActive] = useState('Home');
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const Colors = useGetAppColors();
  const userCtx = useContext(UserContext);

  function navigatePages(pageName) {
    navigation.navigate(pageName);
  }
  function setActiveAndNavigate(pageName) {
    setIsActive(pageName);
    navigatePages(pageName);
  }
  function handleActiveColorChange(pageName) {
    return isActive === pageName ? Colors.selectedNavText : Colors.navTextNormal;
  }
  function handleBackgroundChange(pageName) {
    return isActive === pageName ? Colors.selectedNavBackground : 'transparent';
  }

  return (
    <View style={{ flex: 1, paddingBottom: 60, paddingTop: 60, paddingRight: 10 }}>
      <NavigationButton
        backgroundColor={handleBackgroundChange('Home')}
        icon="playlist-plus"
        onPress={() => setActiveAndNavigate('Home')}
        size={18}
        color={handleActiveColorChange('Home')}
        text={'Lista Artikla'}
        type="MaterialCommunityIcons"
      />

      {/* ORDERS MANAGER */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('Orders')}
        icon="filetext1"
        onPress={() => setActiveAndNavigate('Orders')}
        size={18}
        color={handleActiveColorChange('Orders')}
        text="Porudžbine | Rezervacije"
      />
      {/* <NavigationButton 
        backgroundColor={handleBackgroundChange('Profile')}
        icon="user" 
        onPress={() => setActiveAndNavigate('Profile')} 
        size={18} 
        color={handleActiveColorChange('Profile')}
        text='Profil'
      /> */}

      {/* COLORS | CATEGORIES */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('ColorsCategoriesTabs')}
        icon="color-palette-outline"
        onPress={() => setActiveAndNavigate('ColorsCategoriesTabs')}
        size={18}
        color={handleActiveColorChange('ColorsCategoriesTabs')}
        text="Boje, Kategorije i Dobabljači"
        type="Ionicons"
      />

      {/* COURIERS */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('CouriersTabs')}
        icon="truck-delivery-outline"
        onPress={() => setActiveAndNavigate('CouriersTabs')}
        size={18}
        color={handleActiveColorChange('CouriersTabs')}
        text="Kuriri"
        type="MaterialCommunityIcons"
      />

      {/* PRODUCTS MANAGER */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('ProductsManager')}
        icon="profile"
        onPress={() => setActiveAndNavigate('ProductsManager')}
        size={18}
        color={handleActiveColorChange('ProductsManager')}
        text="Dodaj Artikal"
      />

      {/* USERS MANAGER */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('UserManager')}
        icon="addusergroup"
        onPress={() => setActiveAndNavigate('UserManager')}
        size={18}
        color={handleActiveColorChange('UserManager')}
        text="Upravljanje Korisnicima"
      />

      {/* SETTINGS */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('Settings')}
        icon="setting"
        onPress={() => setActiveAndNavigate('Settings')}
        size={18}
        color={handleActiveColorChange('Settings')}
        text="Podešavanja"
      />

      {/* END OF DAY */}
      <NavigationButton
        backgroundColor={handleBackgroundChange('EndOfDayTabs')}
        icon="file-excel"
        onPress={() => setActiveAndNavigate('EndOfDayTabs')}
        size={18}
        color={handleActiveColorChange('EndOfDayTabs')}
        text="Završi dan"
        type="MaterialCommunityIcons"
      />

      {/* ADMIN DASHBOARD */}
      {userCtx.userRole === 'admin' && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('AdminDashboardTabs')}
          icon="equalizer"
          onPress={() => setActiveAndNavigate('AdminDashboardTabs')}
          size={18}
          color={handleActiveColorChange('AdminDashboardTabs')}
          text="Admin Dashboard"
          type="MaterialCommunityIcons"
        />
      )}

      {/* Bottom Buttons */}
      <View
        style={{
          marginTop: 'auto',
        }}
      >
        <NavigationButton icon="logout" onPress={authCtx.logout} size={18} color={Colors.error} text="Logout" />
      </View>
    </View>
  );
}
