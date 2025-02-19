import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet, Pressable, Share, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './display_product/DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';
import { serachProducts } from '../../util-methods/ProductFilterMethods';
import { DressTypes, ImageTypes, ProductTypes, PurseTypes, SearchParamsTypes } from '../../types/allTsTypes';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import useBatchSelectBackHandler from '../../hooks/useBatchSelectBackHandler';
import BatchModeControlls from './BatchModeControlls';
import { handleRemoveBatch } from '../../util-methods/ProductsBatchRemove';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import ConfirmationModal from '../../util-components/ConfirmationModal';
import useImagePreviewModal from '../../hooks/useImagePreviewModal';
import ImagePreviewModal from '../../util-components/ImagePreviewModal';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;
import ProductListSelector from '../products/ProductListSelector';
import { AppContext } from '../../store/app-context';
import { UserContext } from '../../store/user-context';

interface DisplayProductsPropTypes {
  setEditItem: (data: ProductTypes | null) => void
}
interface SelectedItemsTypes {
  _id: string
  stockType: string 
}
function DisplayProducts({ setEditItem }: DisplayProductsPropTypes) {
  const [selectedItems, setSelectedItems] = useState<SelectedItemsTypes[]>([]);
  const [longPressActivated, setLongPressActivated] = useState(false);
  const [batchMode, setBatchMode] = useState(false);  
  function resetBatch(){
    setBatchMode(false);
    setSelectedItems([]);
  }
  useBatchSelectBackHandler(batchMode, resetBatch);

  const productsCtx = useContext(AllProductsContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [searchData, setSearchData] = useState('');
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const [previewImage, setPreviewImage] = useState<string>('');
  const appCtx = useContext(AppContext);
  const userCtx = useContext(UserContext);
  const [settings, setSettings] = useState(appCtx.defaults);
  const [userSettings, setUserSettings] = useState(userCtx.settings)
  useEffect(() => {
    setSettings(appCtx.defaults);
  }, [appCtx.defaults]);
  useEffect(() => {
    console.log(userCtx.settings)
    setUserSettings(userCtx.settings);
  }, [userCtx.settings])
  
  function handleImagePreview(image:ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }

  const [selectedList, setSelectedList] = useState('Svi');
  useEffect(() => {
    console.log(selectedList)
  }, [selectedList])

  // =============================[ SEARCH INPUT STUFF ]=============================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    isOnStock: false,
    isNotOnStock: false,
    onStockAndSoldOut: false,
    onCategorySearch: '',
    onSupplierSearch: '',
    onColorsSearch: [],
    onSizeSearch: [],
    active: true,
    inactive: false,
  });

  // Handle radio button changes directly through searchParams
  function updateSearchParam<K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  }

  // ============================[ \SEARCH INPUT STUFF\ ]============================

  // Memoize the filtered products
  const filteredData = useMemo(() => {
    if(userSettings?.defaults?.listProductsBy === 'supplier') {
      if(searchParams.active)
        if(selectedList === 'Svi')
          return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
        return serachProducts(searchData, productsCtx?.productsBySuppliers[selectedList] || [], searchParams); 
    }
    if(userSettings?.defaults?.listProductsBy === 'category') {
      if(searchParams.active){
        if(selectedList === 'Svi')
          return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
        return serachProducts(searchData, productsCtx?.productsByCategory[selectedList] || [], searchParams); 
      }
    }

    if(searchParams.active) return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
    if(searchParams.inactive) return serachProducts(searchData, productsCtx.allInactiveProducts, searchParams);
    return [];
  }, [productsCtx.allActiveProducts, productsCtx.allInactiveProducts, searchData, searchParams, selectedList, productsCtx?.productsBySuppliers, productsCtx?.productsByCategory, userSettings?.defaults?.listProductsBy]);

  interface ProductsBySuppliersTypes {
    [supplier: string]: (DressTypes | PurseTypes)[]
  }
  function listFilteringBySupplier(selectedList: string, productsBySuppliers: ProductsBySuppliersTypes | undefined): ProductTypes[]{
    console.log('> listFilteringBySupplier called');
    return productsBySuppliers?.[selectedList] ?? [];
  }

  // Long press that initializes select mode
  function handleLongPress(itemId: string, stockType: string){
    setLongPressActivated(true);
    setTimeout(() => setLongPressActivated(false), 500); // Reset flag after 500ms
    if(selectedItems.length === 0) setSelectedItems([{_id: itemId, stockType}])
    setBatchMode(true);
  }
  // Press handler after select mode is initialized
  function handlePress(itemId: string, stockType: string){
    if (longPressActivated) return;
    if(selectedItems.length === 0) return;
    const isIdSelected = selectedItems?.some((presentItem) => presentItem._id === itemId)
    if(isIdSelected){
      if(selectedItems.length === 1) setBatchMode(false);
      setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
    } else {
      setSelectedItems((prev) => [...prev, {_id: itemId, stockType}]);
    }
  }


  async function handleRemoveBatchProducts() {
    showModal(async () => {
      const response = await handleRemoveBatch(selectedItems, authCtx.token);
      if (response && !response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }
  
      if (!response) {
        return popupMessage('Došlo je do problema prilikom brisanja proizvoda..', 'danger');
      }
  
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'success');
      resetBatch();
    });
  }

  async function handleSortProducts(position: string){
    try{
      const purses = selectedItems
        .filter((purse) => purse.stockType === 'Boja-Količina')
        .map((purse) => purse._id);
      const dresses = selectedItems
        .filter((dress) => dress.stockType === 'Boja-Veličina-Količina')
        .map((dress) => dress._id);

      const data = {
        position,
        purses,
        dresses,
      }
  
      const response = await fetchWithBodyData(token, `products/update-display-priority`, data, 'POST');
      if(!response.ok) return popupMessage('Došlo je do problema prilikom sortiranja proizvoda', 'danger');
  
      if(response?.status === 200){
        const data = await response?.json();
        resetBatch();
        return popupMessage(data.message, 'success');
      } else {
        const data = await response?.json();
        return popupMessage(data.message, 'danger');
      }
    } catch(error){
      console.error(error);
      betterConsoleLog('> There was an error while sorting products,', error);
    }
  }




  return (
    <View style={styles.container}>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={hideModal}
        message="Da li sigurno želiš da obrišeš selektovane proizvode?"
      />
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          isVisible={isImageModalVisible}
          onCancel={hideImageModal}
        />
      )}
      <SearchProducts
        searchData={searchData}
        setSearchData={setSearchData}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        updateSearchParam={updateSearchParam}
      />
      <BatchModeControlls
        active={batchMode}
        onRemoveBatchPress={handleRemoveBatchProducts}
        handleSortProducts={handleSortProducts}
      />
      <ProductListSelector
        products={filteredData}
        setSelectedList={setSelectedList}
      />

      {filteredData && filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => 
            <Pressable
              delayLongPress={100}
              onLongPress={batchMode ? null : () => handleLongPress(item._id, item.stockType)}
              onPress={batchMode ? () => handlePress(item._id, item.stockType) : null}
            >
              <DisplayProduct 
                item={item} 
                setEditItem={setEditItem} 
                highlightedItems={selectedItems}
                batchMode={batchMode}
                onRemoveHighlight={handlePress}
                showImagePreview={handleImagePreview}
              />
            </Pressable>
          }
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productsContainer}
          ListHeaderComponent={() => 
            <Text style={styles.listHeader}>Ukupno Proizvoda: {filteredData.length}</Text>
          }
          initialNumToRender={10} 
          maxToRenderPerBatch={15}
          windowSize={5} 
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  productsContainer: {
    flexGrow: 1,
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  },
})

export default DisplayProducts