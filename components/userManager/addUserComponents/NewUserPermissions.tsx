import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimationWithContentVisibility } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { DropdownTypes } from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import CustomCheckbox from '../../../util-components/CustomCheckbox';
import CustomText from '../../../util-components/CustomText';
import { setAllPermissionsToValue } from '../../../util-methods/setAllPermissions';
import PermissionsRow from './PermissionsRow';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  data: any;
  setData: any;
}
function NewUserPermissions({ isExpanded, setIsExpanded, data, setData }: PropTypes) {
  const fadeAnimation = useToggleFadeAnimation(isExpanded, 180);
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(true);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 950);
  const [userDropdownData, setUserDropdownData] = useState<DropdownTypes[]>([
    { _id: 0, name: 'Admin', value: 'Admin' },
    { _id: 1, name: 'User', value: 'User' },
  ]);

  function handleToggleExpand() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  const toggleNavigation = (field: keyof typeof data.permissions.navigation) => {
    setData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        navigation: {
          ...prev.permissions.navigation,
          [field]: !prev.permissions.navigation[field],
        },
      },
    }));
  };

  const togglePermission = (section: string, field: string) => {
    setData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [field]: !prev.permissions[section][field],
        },
      },
    }));
  };

  function handleAddAllPermissions() {
    setData((prev: any) => ({
      ...prev,
      permissions: setAllPermissionsToValue(prev.permissions, true),
    }));
  }

  return (
    <View>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <CustomText variant="bold" style={[styles.header, { color: colors.whiteText }]}>
          Permisije korisnika
        </CustomText>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={colors.whiteText}
        />
      </Pressable>

      {/* MAIN */}
      {isContentVisible && (
        <Animated.View style={{ height: toggleExpandAnimation, opacity: fadeAnimation, paddingHorizontal: 10, gap: 4 }}>
          <Button
            onPress={handleAddAllPermissions}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
            textColor={colors.defaultText}
          >
            Dodaj sve permisije
          </Button>

          {/* NAVIGATION PERMISSIONS */}
          <PermissionsRow header="Navigacija">
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <View style={styles.navRow}>
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('lista_artikla')}
                  containerStyles={styles.cell}
                  label={'Lista Artikla'}
                  checked={data.permissions.navigation.lista_artikla}
                />
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('porudzbine_rezervacije')}
                  containerStyles={styles.cell}
                  label={'Porudžbine Rezervacije'}
                  checked={data.permissions.navigation.porudzbine_rezervacije}
                />
              </View>

              <View style={styles.navRow}>
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('boje_kategorije_dobavljaci')}
                  containerStyles={styles.cell}
                  label={'Boje Kategorije Dobavljači'}
                  checked={data.permissions.navigation.boje_kategorije_dobavljaci}
                />
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('kuriri')}
                  containerStyles={styles.cell}
                  label={'Kuriri'}
                  checked={data.permissions.navigation.kuriri}
                />
              </View>

              <View style={styles.navRow}>
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('dodaj_artikal')}
                  containerStyles={styles.cell}
                  label={'Dodaj artikal'}
                  checked={data.permissions.navigation.dodaj_artikal}
                />
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('upravljanje_korisnicima')}
                  containerStyles={styles.cell}
                  label={'Upravljanje korisnicima'}
                  checked={data.permissions.navigation.upravljanje_korisnicima}
                />
              </View>

              <View style={styles.navRow}>
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('podesavanja')}
                  containerStyles={styles.cell}
                  label={'Podešavanja'}
                  checked={data.permissions.navigation.podesavanja}
                />
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('zavrsi_dan')}
                  containerStyles={styles.cell}
                  label={'Završi dan'}
                  checked={data.permissions.navigation.zavrsi_dan}
                />
              </View>

              {/* <View style={styles.navRow}>
                <CustomCheckbox
                  customColor={colors.defaultText}
                  checkColor={colors.checkboxCheckColor}
                  onCheckedChange={() => toggleNavigation('admin_dashboard')}
                  containerStyles={styles.cell}
                  label={'Admin Dashboard'}
                  checked={data.permissions.navigation.admin_dashboard}
                />
              </View> */}
            </View>
          </PermissionsRow>

          {/* ARTIKAL */}
          <PermissionsRow header="Artikal" useCheckAll={true}>
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('products', 'create')}
                checked={data.permissions.products.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('products', 'update')}
                checked={data.permissions.products.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('products', 'delete')}
                checked={data.permissions.products.delete}
              />
            </View>
          </PermissionsRow>

          {/* ORDERS */}
          <PermissionsRow header="Porudžbine" useCheckAll={true}>
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('orders', 'create')}
                checked={data.permissions.orders.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('orders', 'update')}
                checked={data.permissions.orders.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('orders', 'delete')}
                checked={data.permissions.orders.delete}
              />
            </View>
          </PermissionsRow>

          {/* PACKAGING */}
          <PermissionsRow
            header="Pakovanje"
            useCheckAll={true}
            isDisabled={!data.permissions.navigation.porudzbine_rezervacije}
          >
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Štikliranje pakovanja'}
                onCheckedChange={() => togglePermission('packaging', 'check')}
                checked={data.permissions.packaging.check}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Završi\npakovanje'}
                onCheckedChange={() => togglePermission('packaging', 'finish_packaging')}
                checked={data.permissions.packaging.finish_packaging}
              />
            </View>
          </PermissionsRow>

          {/* cOLORS */}
          <PermissionsRow
            header="Boje"
            isDisabled={!data.permissions.navigation.boje_kategorije_dobavljaci}
            useCheckAll={true}
          >
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('colors', 'create')}
                checked={data.permissions.colors.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('colors', 'update')}
                checked={data.permissions.colors.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('colors', 'delete')}
                checked={data.permissions.colors.delete}
              />
            </View>
          </PermissionsRow>

          {/* CATEGORIES */}
          <PermissionsRow
            header="Kategorije"
            isDisabled={!data.permissions.navigation.boje_kategorije_dobavljaci}
            useCheckAll={true}
          >
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('categories', 'create')}
                checked={data.permissions.categories.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('categories', 'update')}
                checked={data.permissions.categories.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('categories', 'delete')}
                checked={data.permissions.categories.delete}
              />
            </View>
          </PermissionsRow>

          {/* SUPPLIERS */}
          <PermissionsRow
            header="Dobavljači"
            isDisabled={!data.permissions.navigation.boje_kategorije_dobavljaci}
            useCheckAll={true}
          >
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('suppliers', 'create')}
                checked={data.permissions.suppliers.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('suppliers', 'update')}
                checked={data.permissions.suppliers.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('suppliers', 'delete')}
                checked={data.permissions.suppliers.delete}
              />
            </View>
          </PermissionsRow>

          {/* COURIERS */}
          <PermissionsRow
            header="Kuriri"
            isDisabled={!data.permissions.navigation.boje_kategorije_dobavljaci}
            useCheckAll={true}
          >
            <View style={styles.permissionWrapper}>
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Kreiraj'}
                onCheckedChange={() => togglePermission('couriers', 'create')}
                checked={data.permissions.couriers.create}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Menjaj'}
                onCheckedChange={() => togglePermission('couriers', 'update')}
                checked={data.permissions.couriers.update}
              />
              <CustomCheckbox
                customColor={colors.defaultText}
                checkColor={colors.checkboxCheckColor}
                containerStyles={styles.permissionsItem}
                label={'Briši'}
                onCheckedChange={() => togglePermission('couriers', 'delete')}
                checked={data.permissions.couriers.delete}
              />
            </View>
          </PermissionsRow>
        </Animated.View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.primaryDark,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 20,
      color: colors.highlightText,
    },
    contentContainer: {
      flexDirection: 'column',
      width: '100%',
      gap: 16,
      paddingHorizontal: 16,
    },
    permissionsContainer: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      paddingHorizontal: 8,
      flexDirection: 'column',
      borderRadius: 4,
      marginTop: 16,
    },
    permissionsRow: {
      paddingHorizontal: 8,
      flexDirection: 'column',
      borderRadius: 4,
      flexWrap: 'wrap',
      gap: 8,
      position: 'relative',
      paddingTop: 8,
      paddingLeft: 14,
    },
    permissionHeaderContainer: {
      position: 'absolute',
      top: -18,
      left: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      height: 30,
      paddingHorizontal: 8,
    },
    permissionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    permissionsItem: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      width: '100%',
      gap: 8,
    },
    navRow: {
      flexDirection: 'row',
      gap: 8,
    },
    cell: {
      flex: 1,
      padding: 4,
    },
    permissionWrapper: {
      width: '100%',
      flexDirection: 'row',
      gap: 8,
    },
  });
}

export default NewUserPermissions;
