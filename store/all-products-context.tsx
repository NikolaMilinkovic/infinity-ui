import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { DressesContext } from "./dresses-context";
import { PursesContext } from "./purses-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { DressTypes, ProductTypes, PurseTypes } from "../types/allTsTypes";
import { popupMessage } from "../util-components/PopupMessage";
import { batchProductStockIncrease, decreaseDressBatchStock, decreaseDressStock, decreasePurseBatchStock, decreasePurseStock, increaseDressBatchStock, increaseDressStock, increasePurseStock } from "../util-methods/StockMethods";


interface AllProductsContextType {
  allActiveProducts: (DressTypes | PurseTypes)[];
  allInactiveProducts: (DressTypes | PurseTypes)[];
  allProducts: (DressTypes | PurseTypes)[];
  setAllActiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
  setAllInactiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
  setAllProducts: (products: (DressTypes | PurseTypes)[]) => void;
  fetchAllProducts: () => Promise<void>;
  productsBySuppliers?: ProductsBySuppliersTypes;
  productsByCategory?: ProductsByCategoryTypes;
}

interface AllProductsProviderType {
  children: ReactNode;
}
export const AllProductsContext = createContext<AllProductsContextType>({
  allActiveProducts: [],
  allInactiveProducts: [],
  allProducts: [],
  setAllActiveProducts: () => {},
  setAllInactiveProducts: () => {},
  setAllProducts: () => {},
  fetchAllProducts: async() => {},
  productsBySuppliers: {},
  productsByCategory: {},
})
interface ProductsBySuppliersTypes {
  [supplier: string]: (DressTypes | PurseTypes)[]
}
interface ProductsByCategoryTypes {
  [cateogry: string]: (DressTypes | PurseTypes)[]
}

function AllProductsContextProvider({ children }: AllProductsProviderType){
  const [activeProducts, setActiveProducts] = useState<(DressTypes | PurseTypes)[]>([])
  const [inactiveProducts, setInactiveProducts] = useState<(DressTypes | PurseTypes)[]>([])
  const [allProducts, setAllProducts] = useState<(DressTypes | PurseTypes)[]>([])
  const [productsBySuppliers, setProductsBySuppliers] = useState<ProductsBySuppliersTypes>();
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategoryTypes>();

  const authCtx = useContext(AuthContext)
  const token = authCtx.token
  const socketCtx = useContext(SocketContext)
  const socket = socketCtx?.socket

  // useEffect(() => {
  //   const filteredInactive = inactiveProducts.map((product) => product.name);
  //   // betterConsoleLog('> All inactive products are FROM STORE', filteredInactive);
  //   const filteredActive = activeProducts.map((product) => product.name);
  //   // betterConsoleLog('> All active products are FROM STORE', filteredActive);
  // }, [activeProducts, inactiveProducts])

  // SOCKET METHODS
  function activeProductAddedHandler(newProduct: DressTypes | PurseTypes){
    if(newProduct.active){
        setActiveProducts(prev => [newProduct, ...prev ]);
    } else {
        setInactiveProducts(prev => [newProduct, ...prev ]);
    }
  }
  function inactiveProductAddedHandler(newProduct: DressTypes | PurseTypes){
    if(newProduct.active){
      setActiveProducts(prev => [newProduct, ...prev ]);
    } else {
      setInactiveProducts(prev => [newProduct, ...prev ]);
    }
    // setInactiveProducts(prev => [...prev, newProduct]);
  }
  function activeProductRemovedHandler(productId: string){
    setActiveProducts(prev => prev.filter(product => product._id !== productId));
  }
  function inactiveProductRemovedHandler(productId: string ){
    setInactiveProducts(prev => prev.filter(product => product._id !== productId));
  }
  function activeToInactive(productId: string) {
    setActiveProducts((prevActive) => {
        const movedProduct = prevActive.find((product) => product._id === productId);
        if (movedProduct) {
            const updatedActiveProducts = prevActive.filter(product => product._id !== productId);
            setInactiveProducts(prevInactive => [...prevInactive, movedProduct]);
            return updatedActiveProducts;
        }
        return prevActive;
    });
  }
  function inactiveToActive(productId: string) {
    setInactiveProducts((prevInactive) => {
        const movedProduct = prevInactive.find((product) => product._id === productId);
        if (movedProduct) {
            const updatedInactiveProducts = prevInactive.filter(product => product._id !== productId);
            setActiveProducts(prevActive => [movedProduct, ...prevActive]);
            return updatedInactiveProducts;
        }
        return prevInactive;
    });
  }
  function handleStockDecrease(data: any){
    try{
      console.log('> handleStockDecrease called');
      betterConsoleLog('> Data in handleSrockDecrease is', data);
      // if(!data[0].stockType) return popupMessage('Update stanja nije uspeo, stockType je obavezan!', 'danger');
      for(const item of data){
        if(item.stockType === 'Boja-Veličina-Količina'){
          console.log('> Decreasing Dress Stock');
          decreaseDressStock(item, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>)
        }
        if(item.stockType === 'Boja-Količina'){
          console.log('> Decreasing Purse Stock');
          decreasePurseStock(item, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>)
        }
      }
    } catch (error){
      console.error(error);
    }
  }

  function handleStockIncrease(data: any){
    console.log('> handleStockIncrease called')
    if(!data.stockType) return popupMessage('Update stanja nije uspeo, stockType je obavezan!', 'danger');
    if(data.stockType === 'Boja-Veličina-Količina'){
      increaseDressStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>)
    }
    if(data.stockType === 'Boja-Količina'){
      increasePurseStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>)
    }
  }

  interface PurseStockDataIncrease {
    purseId: string,
    colorId: string,
    increment: number,
  }
  interface DressStockDataIncrease {
    dressId: string,
    colorId: string,
    sizeId: string,
    increment: number,
  }
  interface DataProps {
    dresses: DressStockDataIncrease[]
    purses: PurseStockDataIncrease[]
  }
  const dressesCtx = useContext(DressesContext);
  const pursesCtx = useContext(PursesContext);

  function handleBatchStockIncrease(data: DataProps){

    // Loop over all dresses and increase for each stock
    for(const dress of data.dresses){
      increaseDressStock(dress, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
      increaseDressStock(dress, dressesCtx.setActiveDresses as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    }
    // Loop over all purses and increase for each stock
    for(const purse of data.purses){
      increasePurseStock(purse, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
      increasePurseStock(purse, pursesCtx.setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }

  function handleBatchStockDecreasee(data: DataProps){

    for(const dress of data.dresses){
      decreaseDressStock(dress, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
      decreaseDressStock(dress, dressesCtx.setActiveDresses as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    }
    // Loop over all purses and increase for each stock
    for(const purse of data.purses){
      decreasePurseStock(purse, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
      decreasePurseStock(purse, pursesCtx.setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
    // // Loop over all dresses and increase for each stock
    // if(data.dresses.length > 0){
    //   decreaseDressBatchStock(data.dresses, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    //   decreaseDressBatchStock(data.dresses, dressesCtx.setActiveDresses as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    // }
    // // Loop over all purses and increase for each stock
    // if(data.purses.length > 0){
    //   decreasePurseBatchStock(data.purses, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    //   decreasePurseBatchStock(data.purses, pursesCtx.setActivePurses as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    // }
  }

  // Handle setting ALL PRODUCTS
  useEffect(() => {
    setAllProducts([...activeProducts, ...inactiveProducts]);
    setProductsBySuppliers(sortProductsBySupplier([...activeProducts, ...inactiveProducts]));
    setProductsByCategory(sortProductsByCategory([...activeProducts, ...inactiveProducts]));
  }, [activeProducts, inactiveProducts]);

  function sortProductsBySupplier(products: ProductTypes[]){
    const groupedBySupplier: Record<string, ProductTypes[]> = {};
    products.forEach(product => {
      const supplier = product.supplier || "Other";
      if (!groupedBySupplier[supplier]) {
        groupedBySupplier[supplier] = [];
      }
      groupedBySupplier[supplier].push(product);
    });

    return groupedBySupplier;
  }
  function sortProductsByCategory(products: ProductTypes[]){
    const groupedByCategory: Record<string, ProductTypes[]> = {};
    products.forEach(product => {
      const category = product.category || "Other";
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(product);
    });

    return groupedByCategory;
  }

  function handleActiveProductUpdated(updatedProduct: ProductTypes){
    setActiveProducts((prevProducts) => 
      prevProducts.map((product) => 
        product._id === updatedProduct._id.toString() ? updatedProduct : product
      )
    )
  }
  function handleInactiveProductUpdated(updatedProduct: ProductTypes){
    setInactiveProducts((prevProducts) => 
      prevProducts.map((product) => 
        product._id === updatedProduct._id.toString() ? updatedProduct : product
      )
    )
  }

  interface DisplayPriorityUpdateDataTypes {
    displayPriority: number
    products: string[]
  }
  function handleUpdateProductDisplayPriority(updateData: DisplayPriorityUpdateDataTypes){
    setActiveProducts((prev) => {
      const updated = prev.map((item) =>
        updateData.products.includes(item._id)
          ? { ...item, displayPriority: updateData.displayPriority }
          : item
      );
      betterConsoleLog('> updated active products', updated);
      return updated;
    });
  }

  useEffect(() => {
    if(socket){
      socket.on('activeProductAdded', activeProductAddedHandler);
      socket.on('inactiveProductAdded', inactiveProductAddedHandler);
      socket.on('activeProductRemoved', activeProductRemovedHandler);
      socket.on('inactiveProductRemoved', inactiveProductRemovedHandler);
      socket.on('activeToInactive', activeToInactive);
      socket.on('inactiveToActive', inactiveToActive);
      socket.on('allProductStockDecrease', handleStockDecrease);
      socket.on('allProductStockIncrease', handleStockIncrease);
      socket.on('batchStockIncrease', handleBatchStockIncrease);
      socket.on('batchStockDecrease', handleBatchStockDecreasee);
      socket.on('activeProductUpdated', handleActiveProductUpdated);
      socket.on('inactiveProductUpdated', handleInactiveProductUpdated);
      socket.on('updateProductDisplayPriority', handleUpdateProductDisplayPriority);

      return () => {
        socket.off('activeProductAdded', activeProductAddedHandler);
        socket.off('inactiveProductAdded', inactiveProductAddedHandler);
        socket.off('activeProductRemoved', activeProductRemovedHandler);
        socket.off('inactiveProductRemoved', inactiveProductRemovedHandler);
        socket.off('activeToInactive', activeToInactive);
        socket.off('inactiveToActive', inactiveToActive);
        socket.off('allProductStockDecrease', handleStockDecrease);
        socket.off('allProductStockIncrease', handleStockIncrease);
        socket.off('batchStockIncrease', handleBatchStockIncrease);
        socket.off('batchStockDecrease', handleBatchStockDecreasee);
        socket.off('activeProductUpdated', handleActiveProductUpdated);
        socket.off('inactiveProductUpdated', handleInactiveProductUpdated);
        socket.off('updateProductDisplayPriority', handleUpdateProductDisplayPriority);
      };
    }
  },[socket])

  function mergeSortedProductArrays(arrA: DressTypes[], arrB: PurseTypes[]) {
    let i = 0, j = 0;
    const merged = [];
  
    while (i < arrA.length && j < arrB.length) {
      if (arrA[i].displayPriority > arrB[j].displayPriority) {
        merged.push(arrA[i++]);
      } else {
        merged.push(arrB[j++]);
      }
    }
  
    return merged.concat(arrA.slice(i)).concat(arrB.slice(j));
  }

  useEffect(() => {
    async function getProductsData() {
      if (token) {
        try {
          const [activeDresses, activePurses, inactiveDresses, inactivePurses] = await Promise.all([
            fetchData(token, 'products/active-dresses'),
            fetchData(token, 'products/active-purses'),
            fetchData(token, 'products/inactive-dresses'),
            fetchData(token, 'products/inactive-purses')
          ]);
          
          setActiveProducts(mergeSortedProductArrays(activeDresses, activePurses));
          setInactiveProducts(mergeSortedProductArrays(inactiveDresses, inactivePurses));
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    }
    getProductsData();
  }, [token]);

  async function getProductsData() {
    if (token) {
      try {
        const [activeDresses, activePurses, inactiveDresses, inactivePurses] = await Promise.all([
          fetchData(token, 'products/active-dresses'),
          fetchData(token, 'products/active-purses'),
          fetchData(token, 'products/inactive-dresses'),
          fetchData(token, 'products/inactive-purses')
        ]);
        
        setActiveProducts(mergeSortedProductArrays(activeDresses, activePurses));
        setInactiveProducts(mergeSortedProductArrays(inactiveDresses, inactivePurses));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }

  // Memoizing the getters
  const value = useMemo(() => ({
    allActiveProducts: activeProducts,
    allInactiveProducts: inactiveProducts,
    allProducts,
    setAllActiveProducts: setActiveProducts,
    setAllInactiveProducts: setInactiveProducts,
    setAllProducts,
    fetchAllProducts: getProductsData,
    productsBySuppliers: productsBySuppliers ?? {},
    productsByCategory: productsByCategory ?? {},
  }), [activeProducts, inactiveProducts, allProducts, productsBySuppliers, productsByCategory]);

  return <AllProductsContext.Provider value={value}>{children}</AllProductsContext.Provider>;
}

export default AllProductsContextProvider