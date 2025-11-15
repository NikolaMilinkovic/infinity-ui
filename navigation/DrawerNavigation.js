import { useNavigation } from '@react-navigation/native';
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import DrawerSectionText from '../components/navigation/drawer/DrawerSectionText';
import NavigationButton from '../components/navigation/drawer/NavigationButton';
import { AuthContext } from '../store/auth-context';
import { useThemeColors } from '../store/theme-context';
import { useUser } from '../store/user-context';

/**
 * Handles display of icons / screens in the drawer menu
 * Buttons inside the drawer navigation, handles displaying the screens
 */
export const CustomDrawerContent = forwardRef((props, ref) => {
  const [isActive, setIsActive] = useState('Home');

  useEffect(() => {
    setIsActive('Home');
  }, []);

  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const { user, userHasPermission } = useUser();
  const colors = useThemeColors();

  // Expose setIsActive to parent
  useImperativeHandle(ref, () => ({
    setActive: (pageName) => setIsActive(pageName),
  }));

  function navigatePages(pageName) {
    navigation.navigate(pageName);
  }
  function setActiveAndNavigate(pageName) {
    setIsActive(pageName);
    navigatePages(pageName);
  }
  function handleActiveColorChange(pageName) {
    return isActive === pageName ? colors.selectedNavText : colors.navTextNormal;
  }
  function handleBackgroundChange(pageName) {
    return isActive === pageName ? colors.selectedNavBackground : 'transparent';
  }
  if (!user?.permissions) return;

  return (
    <View style={{ flex: 1, paddingBottom: 60, paddingTop: 60, paddingRight: 10 }}>
      {/* ==========================[ DNEVNE OPERACIJE | RAD ]========================== */}
      <DrawerSectionText text="Rad" />
      {userHasPermission('lista_artikla') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('Home')}
          icon="playlist-plus"
          onPress={() => setActiveAndNavigate('Home')}
          size={16}
          color={handleActiveColorChange('Home')}
          text={'Lista Artikla'}
          type="MaterialCommunityIcons"
        />
      )}

      {/* ORDERS MANAGER */}
      {userHasPermission('porudzbine_rezervacije') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('Orders')}
          icon="ordered-list"
          onPress={() => setActiveAndNavigate('Orders')}
          size={16}
          color={handleActiveColorChange('Orders')}
          text="Porudžbine | Rezervacije"
        />
      )}

      {/* END OF DAY */}
      {userHasPermission('zavrsi_dan') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('EndOfDayTabs')}
          icon="file-excel"
          onPress={() => setActiveAndNavigate('EndOfDayTabs')}
          size={16}
          color={handleActiveColorChange('EndOfDayTabs')}
          text="Završi dan"
          type="MaterialCommunityIcons"
        />
      )}
      {/* ==========================[ \DNEVNE OPERACIJE | RAD ]========================== */}

      {/* ==========================[ KONFIGURACIJA OSNOVNIH PODATAKA ]========================== */}
      <DrawerSectionText text="Konfiguracija osnovnih podataka" />

      {/* COLORS | CATEGORIES */}
      {userHasPermission('boje_kategorije_dobavljaci') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('ColorsCategoriesTabs')}
          icon="color-palette-outline"
          onPress={() => setActiveAndNavigate('ColorsCategoriesTabs')}
          size={16}
          color={handleActiveColorChange('ColorsCategoriesTabs')}
          text="Boje i Kategorije"
          type="Ionicons"
        />
      )}

      {/* COURIERS */}
      {userHasPermission('kuriri') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('CouriersTabs')}
          icon="truck-delivery-outline"
          onPress={() => setActiveAndNavigate('CouriersTabs')}
          size={16}
          color={handleActiveColorChange('CouriersTabs')}
          text="Kuriri i Dobavljači"
          type="MaterialCommunityIcons"
        />
      )}

      {/* PRODUCTS MANAGER */}
      {userHasPermission('dodaj_artikal') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('ProductsManager')}
          icon="product"
          onPress={() => setActiveAndNavigate('ProductsManager')}
          size={16}
          color={handleActiveColorChange('ProductsManager')}
          text="Dodavanje Artikala"
        />
      )}

      {/* EXCEL MANAGER */}
      {userHasPermission('excel_manager') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('ExcelManagerTabs')}
          icon="microsoft-excel"
          type="MaterialCommunityIcons"
          onPress={() => setActiveAndNavigate('ExcelManagerTabs')}
          size={16}
          color={handleActiveColorChange('ExcelManagerTabs')}
          text="Excel šabloni"
        />
      )}
      {/* ==========================[ \KONFIGURACIJA OSNOVNIH PODATAKA ]========================== */}

      {/* ==========================[ ADMIN ]========================== */}
      <DrawerSectionText text="Administracija" />
      {/* ADMIN DASHBOARD */}
      {user?.role === 'admin' && userHasPermission('admin_dashboard') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('AdminDashboardTabs')}
          icon="equalizer"
          onPress={() => setActiveAndNavigate('AdminDashboardTabs')}
          size={16}
          color={handleActiveColorChange('AdminDashboardTabs')}
          text="Admin Dashboard"
          type="MaterialCommunityIcons"
        />
      )}
      {/* USERS MANAGER */}
      {userHasPermission('upravljanje_korisnicima') && (
        <NavigationButton
          backgroundColor={handleBackgroundChange('UserManagerTabs')}
          icon="usergroup-add"
          onPress={() => setActiveAndNavigate('UserManagerTabs')}
          size={16}
          color={handleActiveColorChange('UserManagerTabs')}
          text="Upravljanje Korisnicima"
        />
      )}
      {/* ==========================[ \ADMIN ]========================== */}

      {/* ==========================[ GLOBAL ]========================== */}
      {user.isSuperAdmin && (
        <>
          <DrawerSectionText text="Global" />
          {/* GLOBAL DASHBOARD */}
          {user?.role === 'admin' && userHasPermission('global_dashboard') && (
            <NavigationButton
              backgroundColor={handleBackgroundChange('GlobalDashboardTabs')}
              icon="equalizer"
              onPress={() => setActiveAndNavigate('GlobalDashboardTabs')}
              size={16}
              color={handleActiveColorChange('GlobalDashboardTabs')}
              text="Global Dashboard"
              type="MaterialCommunityIcons"
            />
          )}
        </>
      )}
      {/* ==========================[ \GLOBAL ]========================== */}

      {/* ==========================[ BOTTOM BUTTONS ]========================== */}
      <View
        style={{
          marginTop: 'auto',
        }}
      >
        {/* SETTINGS */}
        {userHasPermission('podesavanja') && (
          <NavigationButton
            backgroundColor={handleBackgroundChange('SettingsTabs')}
            icon="setting"
            onPress={() => setActiveAndNavigate('SettingsTabs')}
            size={16}
            color={handleActiveColorChange('SettingsTabs')}
            text="Podešavanja"
          />
        )}
        <NavigationButton icon="logout" onPress={authCtx.logout} size={16} color={colors.error} text="Logout" />
      </View>
      {/* ==========================[ \BOTTOM BUTTONS ]========================== */}
    </View>
  );
});
