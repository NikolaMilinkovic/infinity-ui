import React, { useContext, useState, useMemo, useEffect } from 'react'
import { View, StyleSheet, Pressable, Share } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import SearchProducts from './SearchProducts';
import DisplayProduct from './display_product/DisplayProduct';
import { AllProductsContext } from '../../store/all-products-context';
import { serachProducts } from '../../util-methods/ProductFilterMethods';
import { ProductTypes, SearchParamsTypes } from '../../types/allTsTypes';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import useBatchSelectBackHandler from '../../hooks/useBatchSelectBackHandler';
import BatchModeControlls from './BatchModeControlls';
import { handleRemoveBatch } from '../../util-methods/ProductsBatchRemove';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import ConfirmationModal from '../../util-components/ConfirmationModal';

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

  // =============================[ SEARCH INPUT STUFF ]=============================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParamsTypes>({
    isOnStock: false,
    isNotOnStock: false,
    onStockAndSoldOut: false,
    onCategorySearch: '',
    onColorsSearch: [],
    onSizeSearch: [],
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
    return serachProducts(searchData, productsCtx.allActiveProducts, searchParams); 
  }, [productsCtx.allActiveProducts, searchData, searchParams]);


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

  useEffect(() => {
    betterConsoleLog('> Selected items are: ', selectedItems);
  }, [selectedItems])
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();


  async function handleRemoveBatchProducts() {
    await showModal(async () => {
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