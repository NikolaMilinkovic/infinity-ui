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
  if (!userCtx.permissions) return;

  return (
    <View style={{ flex: 1, paddingBottom: 60, paddingTop: 60, paddingRight: 10 }}>
      {userCtx.permissions.navigation.lista_artikla && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('Home')}
          icon="playlist-plus"
          onPress={() => setActiveAndNavigate('Home')}
          size={18}
          color={handleActiveColorChange('Home')}
          text={'Lista Artikla'}
          type="MaterialCommunityIcons"
        />
      )}

      {/* ORDERS MANAGER */}
      {userCtx.permissions.navigation.porudzbine_rezervacije && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('Orders')}
          icon="filetext1"
          onPress={() => setActiveAndNavigate('Orders')}
          size={18}
          color={handleActiveColorChange('Orders')}
          text="Porudžbine | Rezervacije"
        />
      )}

      {/* <NavigationButton 
        backgroundColor={handleBackgroundChange('Profile')}
        icon="user" 
        onPress={() => setActiveAndNavigate('Profile')} 
        size={18} 
        color={handleActiveColorChange('Profile')}
        text='Profil'
        /> */}

      {/* COLORS | CATEGORIES */}
      {userCtx.permissions.navigation.boje_kategorije_dobavljaci && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('ColorsCategoriesTabs')}
          icon="color-palette-outline"
          onPress={() => setActiveAndNavigate('ColorsCategoriesTabs')}
          size={18}
          color={handleActiveColorChange('ColorsCategoriesTabs')}
          text="Boje i Kategorije"
          type="Ionicons"
        />
      )}

      {/* COURIERS */}
      {userCtx.permissions.navigation.kuriri && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('CouriersTabs')}
          icon="truck-delivery-outline"
          onPress={() => setActiveAndNavigate('CouriersTabs')}
          size={18}
          color={handleActiveColorChange('CouriersTabs')}
          text="Kuriri i Dobavljači"
          type="MaterialCommunityIcons"
        />
      )}

      {/* PRODUCTS MANAGER */}
      {userCtx.permissions.navigation.dodaj_artikal && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('ProductsManager')}
          icon="profile"
          onPress={() => setActiveAndNavigate('ProductsManager')}
          size={18}
          color={handleActiveColorChange('ProductsManager')}
          text="Dodaj Artikal"
        />
      )}

      {/* USERS MANAGER */}
      {userCtx.permissions.navigation.upravljanje_korisnicima && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('UserManagerTabs')}
          icon="addusergroup"
          onPress={() => setActiveAndNavigate('UserManagerTabs')}
          size={18}
          color={handleActiveColorChange('UserManagerTabs')}
          text="Upravljanje Korisnicima"
        />
      )}

      {/* SETTINGS */}
      {userCtx.permissions.navigation.podesavanja && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('SettingsTabs')}
          icon="setting"
          onPress={() => setActiveAndNavigate('SettingsTabs')}
          size={18}
          color={handleActiveColorChange('SettingsTabs')}
          text="Podešavanja"
        />
      )}

      {/* END OF DAY */}
      {userCtx.permissions.navigation.zavrsi_dan && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('EndOfDayTabs')}
          icon="file-excel"
          onPress={() => setActiveAndNavigate('EndOfDayTabs')}
          size={18}
          color={handleActiveColorChange('EndOfDayTabs')}
          text="Završi dan"
          type="MaterialCommunityIcons"
        />
      )}

      {/* ADMIN DASHBOARD */}
      {userCtx.userRole === 'admin' && userCtx.permissions.navigation.admin_dashboard && (
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
