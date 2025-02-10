import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View,TouchableOpacity, ScrollView } from 'react-native'
import { betterConsoleLog } from '../../util-methods/LogMethods';
import { AppContext } from '../../store/app-context';
import IconButton from '../../util-components/IconButton';
import { Colors } from '../../constants/colors';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SuppliersContext } from '../../store/suppliers-context';
import { ProductTypes } from '../../types/allTsTypes';
import { CategoriesContext } from '../../store/categories-context';

interface ProductListSelectorPropTypes{
  products: ProductTypes[]
  setSelectedList: () => void
}

function ProductListSelector({ products, setSelectedList }: ProductListSelectorPropTypes) {
  const appCtx = useContext(AppContext);
  const [settings, setSettings] = useState(appCtx.defaults);

  useEffect(() => {
    setSettings(appCtx.defaults);
  }, [appCtx.defaults]);

  return (
    <View>
      {/* SUPPLIER */}
      {settings?.defaults?.listProductsBy === 'supplier' && (
        <ListProductsBySupplier products={products} setSelectedList={setSelectedList} />
      )}

      {/* CATEGORY */}
      {settings?.defaults?.listProductsBy === 'category' && (
        <ListProductsByCategory products={products} setSelectedList={setSelectedList} />
      )}
    </View>
  )
}

interface ListButtonPropTypes{
  text: string;
  activeBtn: string;
  onPress: (text: string) => void;
}
/**
 * Button component that is displayed in each List Types 
 */
function ListButton({ text, activeBtn, onPress }: ListButtonPropTypes){
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if(activeBtn === text){
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeBtn])

  return(
    <TouchableOpacity
      style={{
        padding: 10,
        backgroundColor: isActive ? Colors.secondaryDark : Colors.secondaryLight,
        borderRadius: 5,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: isActive ? Colors.highlight : Colors.secondaryLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      }}
      onPress={() => onPress(text)}
    >
      <Text style={{ color: isActive ? Colors.white : Colors.primaryDark }}>{text}</Text>
    </TouchableOpacity>
  )
}

interface ListProductsBySupplierPropTypes{ 
  products: ProductTypes[], 
  setSelectedList: (list: string) => void 
} 
function ListProductsBySupplier({ products, setSelectedList }: ListProductsBySupplierPropTypes){
  const suppliers = useContext(SuppliersContext);
  const [activeBtn, setActiveBtn] = useState('Svi');
  function onListChange(text:string){
    setActiveBtn(text);
    setSelectedList(text);
  }
  
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={supplierStyles.scrollView}>
        <View style={supplierStyles.buttonsWrapper}>
          <ListButton text={'Svi'} activeBtn={activeBtn} onPress={onListChange} />
          {suppliers.suppliers.map((supplier, index) => (
            <ListButton
              text={supplier.name}
              activeBtn={activeBtn}
              key={index}
              onPress={onListChange}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
const supplierStyles = StyleSheet.create({
  scrollView: {
  },
  buttonsWrapper: {
    flexDirection: 'row', 
    padding: 10, 
    gap: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
  }
})


function ListProductsByCategory({ products, setSelectedList }: ListProductsBySupplierPropTypes){
  const categories = useContext(CategoriesContext);
  const [activeBtn, setActiveBtn] = useState('Svi');
  function onListChange(text:string){
    setActiveBtn(text);
    setSelectedList(text);
  }
  
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={supplierStyles.scrollView}>
        <View style={supplierStyles.buttonsWrapper}>
          <ListButton text={'Svi'} activeBtn={activeBtn} onPress={onListChange} />
          {categories.categories.map((category, index) => (
            <ListButton
              text={category.name}
              activeBtn={activeBtn}
              key={index}
              onPress={onListChange}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
export default ProductListSelector