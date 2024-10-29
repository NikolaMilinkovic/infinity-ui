import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet, Pressable, Share } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './display_product/DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';
import { serachProducts } from '../../util-methods/ProductFilterMethods';
import { ImageTypes, ProductTypes, SearchParamsTypes } from '../../types/allTsTypes';
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
  const [searchData, setSearchData] = useState('');
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const [previewImage, setPreviewImage] = useState<string>('');
  
  function handleImagePreview(image:ImageTypes) {
    setPreviewImage(image);
    showImageModal();
  }

  // =============================[ SEARCH INPUT STUFF ]=============================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    isOnStock: false,
    isNotOnStock: false,
    onStockAndSoldOut: false,
    onCategorySearch: '',
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
    // console.log('> ACTIVE Search params are> ', searchParams.active)
    // console.log('> INACTIVE Search params are> ', searchParams.inactive)
    // const filteredInactive = productsCtx.allInactiveProducts.map((product) => product.name);
    // betterConsoleLog('> All inactive products are', filteredInactive);
    // const filteredActive = productsCtx.allActiveProducts.map((product) => product.name);
    // betterConsoleLog('> All active products are', filteredActive)

    if(searchParams.active) return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
    if(searchParams.inactive) return serachProducts(searchData, productsCtx.allInactiveProducts, searchParams); 
  }, [productsCtx.allActiveProducts, productsCtx.allInactiveProducts, searchData, searchParams]);

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
})

export default DisplayProducts