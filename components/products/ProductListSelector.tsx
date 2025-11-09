import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { CategoriesContext } from '../../store/categories-context';
import { SuppliersContext } from '../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import { ProductTypes } from '../../types/allTsTypes';
import CustomText from '../../util-components/CustomText';

interface ProductListSelectorPropTypes {
  products: ProductTypes[];
  setSelectedList: Dispatch<SetStateAction<string>>;
}

function ProductListSelector({ products, setSelectedList }: ProductListSelectorPropTypes) {
  const { user } = useUser();

  return (
    <View>
      {/* SUPPLIER */}
      {user?.settings?.defaults?.listProductsBy === 'supplier' && (
        <ListProductsBySupplier products={products} setSelectedList={setSelectedList} />
      )}

      {/* CATEGORY */}
      {user?.settings?.defaults?.listProductsBy === 'category' && (
        <ListProductsByCategory products={products} setSelectedList={setSelectedList} />
      )}
    </View>
  );
}

interface ListButtonPropTypes {
  text: string;
  activeBtn: string;
  onPress: (text: string) => void;
}
/**
 * Button component that is displayed in each List Types
 */
function ListButton({ text, activeBtn, onPress }: ListButtonPropTypes) {
  const [isActive, setIsActive] = useState(false);
  const colors = useThemeColors();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (activeBtn === text) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeBtn]);

  return (
    <TouchableOpacity
      style={[
        {
          padding: 10,
          backgroundColor: isActive ? colors.productGroupSelectedHighlight : colors.productGroupBackground,
          minWidth: 60,
          alignItems: 'center',
          justifyContent: 'center',
        },
        globalStyles.border,
      ]}
      onPress={() => onPress(text)}
    >
      <CustomText style={{ color: isActive ? colors.whiteText : colors.productGroupTextColor }}>{text}</CustomText>
    </TouchableOpacity>
  );
}

interface ListProductsBySupplierPropTypes {
  products: ProductTypes[];
  setSelectedList: (list: string) => void;
}
function ListProductsBySupplier({ products, setSelectedList }: ListProductsBySupplierPropTypes) {
  const suppliers = useContext(SuppliersContext);
  const colors = useThemeColors();
  const supplierStyles = getSupplierStyles(colors);
  const [activeBtn, setActiveBtn] = useState('Svi');
  function onListChange(text: string) {
    setActiveBtn(text);
    setSelectedList(text);
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={supplierStyles.scrollView}>
        <View style={supplierStyles.buttonsWrapper}>
          <ListButton text={'Svi'} activeBtn={activeBtn} onPress={onListChange} />
          {suppliers.suppliers.map((supplier, index) => (
            <ListButton text={supplier.name} activeBtn={activeBtn} key={index} onPress={onListChange} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
function getSupplierStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollView: {},
    buttonsWrapper: {
      flexDirection: 'row',
      padding: 10,
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

function ListProductsByCategory({ products, setSelectedList }: ListProductsBySupplierPropTypes) {
  const categories = useContext(CategoriesContext);
  const colors = useThemeColors();
  const categoryStyles = getCategoryStyles(colors);
  const [activeBtn, setActiveBtn] = useState('Svi');
  function onListChange(text: string) {
    setActiveBtn(text);
    setSelectedList(text);
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={categoryStyles.scrollView}>
        <View style={categoryStyles.buttonsWrapper}>
          <ListButton text={'Svi'} activeBtn={activeBtn} onPress={onListChange} />
          {categories.categories.map((category, index) => (
            <ListButton text={category.name} activeBtn={activeBtn} key={index} onPress={onListChange} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function getCategoryStyles(colors: ThemeColors) {
  return StyleSheet.create({
    scrollView: {},
    buttonsWrapper: {
      flexDirection: 'row',
      padding: 10,
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
export default ProductListSelector;
