import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { DressTypes, ProductTypes, PurseTypes } from '../types/allTsTypes';
import { popupMessage } from '../util-components/PopupMessage';
import { fetchData } from '../util-methods/FetchMethods';
import { betterErrorLog } from '../util-methods/LogMethods';
import {
  decreaseDressStock,
  decreasePurseStock,
  increaseDressStock,
  increasePurseStock,
} from '../util-methods/StockMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface AllProductsContextType {
  allActiveProducts: (DressTypes | PurseTypes)[];
  allInactiveProducts: (DressTypes | PurseTypes)[];
  allProducts: (DressTypes | PurseTypes)[];
  setAllActiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
  setAllInactiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
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
  fetchAllProducts: async () => {},
  productsBySuppliers: {},
  productsByCategory: {},
});
interface ProductsBySuppliersTypes {
  [supplier: string]: (DressTypes | PurseTypes)[];
}
interface ProductsByCategoryTypes {
  [cateogry: string]: (DressTypes | PurseTypes)[];
}

function AllProductsContextProvider({ children }: AllProductsProviderType) {
  const [activeProducts, setActiveProducts] = useState<(DressTypes | PurseTypes)[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<(DressTypes | PurseTypes)[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const allProducts = useMemo(() => {
    return [...activeProducts, ...inactiveProducts];
  }, [activeProducts, inactiveProducts]);

  const productsBySuppliers = useMemo(() => {
    return sortProductsBySupplier(allProducts);
  }, [allProducts]);

  const productsByCategory = useMemo(() => {
    return sortProductsByCategory(allProducts);
  }, [allProducts]);

  // SOCKET METHODS
  function activeProductAddedHandler(newProduct: DressTypes | PurseTypes) {
    if (newProduct.active) {
      setActiveProducts((prev) => [newProduct, ...prev]);
    } else {
      setInactiveProducts((prev) => [newProduct, ...prev]);
    }
  }
  function inactiveProductAddedHandler(newProduct: DressTypes | PurseTypes) {
    if (newProduct.active) {
      setActiveProducts((prev) => [newProduct, ...prev]);
    } else {
      setInactiveProducts((prev) => [newProduct, ...prev]);
    }
  }
  function activeProductRemovedHandler(productId: string) {
    setActiveProducts((prev) => prev.filter((product) => product._id !== productId));
  }
  function inactiveProductRemovedHandler(productId: string) {
    setInactiveProducts((prev) => prev.filter((product) => product._id !== productId));
  }
  function activeToInactive(productId: string) {
    setActiveProducts((prevActive) => {
      const movedProduct = prevActive.find((product) => product._id === productId);
      if (movedProduct) {
        const updatedActiveProducts = prevActive.filter((product) => product._id !== productId);
        setInactiveProducts((prevInactive) => [...prevInactive, movedProduct]);
        return updatedActiveProducts;
      }
      return prevActive;
    });
  }
  function inactiveToActive(productId: string) {
    setInactiveProducts((prevInactive) => {
      const movedProduct = prevInactive.find((product) => product._id === productId);
      if (movedProduct) {
        const updatedInactiveProducts = prevInactive.filter((product) => product._id !== productId);
        setActiveProducts((prevActive) => [movedProduct, ...prevActive]);
        return updatedInactiveProducts;
      }
      return prevInactive;
    });
  }

  function handleUpdateProduct(updateData: Record<string, DressTypes | PurseTypes>) {
    const updateDataMap = new Map(Object.entries(updateData));
    try {
      setActiveProducts((prevProducts) => {
        const updated = [...prevProducts];

        for (let i = 0; i < updated.length; i++) {
          const product = updated[i];
          const updatedItem = updateDataMap.get(product._id?.toString());

          if (updatedItem) {
            updated[i] = updatedItem as any;
            updateDataMap.delete(product._id?.toString());
          }
        }

        return updated;
      });
    } catch (error) {
      console.error('Error updating products:', error);
    }
  }

  function handleStockIncrease(data: any) {
    if (!data.stockType) return popupMessage('Update stanja nije uspeo, stockType je obavezan!', 'danger');
    if (data.stockType === 'Boja-Veličina-Količina') {
      increaseDressStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    }
    if (data.stockType === 'Boja-Količina') {
      increasePurseStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }

  interface PurseStockDataIncrease {
    purseId: string;
    colorId: string;
    increment: number;
  }
  interface DressStockDataIncrease {
    dressId: string;
    colorId: string;
    sizeId: string;
    increment: number;
  }
  interface DataProps {
    dresses: DressStockDataIncrease[];
    purses: PurseStockDataIncrease[];
  }
  function handleBatchStockIncrease(data: DataProps) {
    for (const dress of data.dresses) {
      increaseDressStock(dress, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    }
    // Loop over all purses and increase for each stock
    for (const purse of data.purses) {
      increasePurseStock(purse, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }

  interface PurseStockDataDecrease {
    purseId: string;
    colorId: string;
    increment: number;
  }
  interface DressStockDataDecrease {
    dressId: string;
    colorId: string;
    sizeId: string;
    increment: number;
  }
  interface DataPropsDecrease {
    dresses: DressStockDataDecrease[];
    purses: PurseStockDataDecrease[];
  }
  function handleBatchStockDecreasee(data: DataPropsDecrease) {
    for (const dress of data.dresses) {
      decreaseDressStock(dress, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>);
    }
    for (const purse of data.purses) {
      decreasePurseStock(purse, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>);
    }
  }

  // Handle setting ALL PRODUCTS
  // useEffect(() => {
  //   setAllProducts([...activeProducts, ...inactiveProducts]);
  //   setProductsBySuppliers(sortProductsBySupplier([...activeProducts, ...inactiveProducts]));
  //   setProductsByCategory(sortProductsByCategory([...activeProducts, ...inactiveProducts]));
  // }, [activeProducts, inactiveProducts]);

  function sortProductsBySupplier(products: ProductTypes[]) {
    const groupedBySupplier: Record<string, ProductTypes[]> = {};
    products.forEach((product) => {
      const supplier = product.supplier || 'Other';
      if (!groupedBySupplier[supplier]) {
        groupedBySupplier[supplier] = [];
      }
      groupedBySupplier[supplier].push(product);
    });

    return groupedBySupplier;
  }
  function sortProductsByCategory(products: ProductTypes[]) {
    const groupedByCategory: Record<string, ProductTypes[]> = {};
    products.forEach((product) => {
      const category = product.category || 'Other';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(product);
    });

    return groupedByCategory;
  }

  function handleActiveProductUpdated(updatedProduct: ProductTypes) {
    setActiveProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === updatedProduct._id.toString() ? updatedProduct : product))
    );
  }
  function handleInactiveProductUpdated(updatedProduct: ProductTypes) {
    setInactiveProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === updatedProduct._id.toString() ? updatedProduct : product))
    );
  }

  interface DisplayPriorityUpdateDataTypes {
    displayPriority: number;
    products: string[];
  }
  function handleUpdateProductDisplayPriority(updateData: DisplayPriorityUpdateDataTypes) {
    setActiveProducts((prev) => {
      const updated = prev.map((item) =>
        updateData.products.includes(item._id) ? { ...item, displayPriority: updateData.displayPriority } : item
      );
      return updated;
    });
  }

  useEffect(() => {
    function handleUpdateProduct(updateData: Record<string, DressTypes | PurseTypes>) {
      const updateDataMap = new Map(Object.entries(updateData));
      try {
        setActiveProducts((prevProducts) => {
          console.log('🔵 Inside setActiveProducts callback');
          console.log('🔵 prevProducts[0] stock:', prevProducts[0]?.totalStock);

          const updated = [...prevProducts];

          for (let i = 0; i < updated.length; i++) {
            const product = updated[i];
            const updatedItem = updateDataMap.get(product._id?.toString());

            if (updatedItem) {
              console.log('🔵 Updating product, old stock:', product.totalStock, 'new stock:', updatedItem.totalStock);
              updated[i] = updatedItem as any;
              updateDataMap.delete(product._id?.toString());
            }
          }

          console.log('🔵 Returning updated[0] stock:', updated[0]?.totalStock);
          return updated;
        });
      } catch (error) {
        console.error('Error updating products:', error);
      }
    }
    if (socket) {
      socket.on('activeProductAdded', activeProductAddedHandler);
      socket.on('inactiveProductAdded', inactiveProductAddedHandler);
      socket.on('activeProductRemoved', activeProductRemovedHandler);
      socket.on('inactiveProductRemoved', inactiveProductRemovedHandler);
      socket.on('activeToInactive', activeToInactive);
      socket.on('inactiveToActive', inactiveToActive);
      socket.on('allProductStockDecrease', handleUpdateProduct);
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
        socket.off('allProductStockDecrease', handleUpdateProduct);
        socket.off('allProductStockIncrease', handleStockIncrease);
        socket.off('batchStockIncrease', handleBatchStockIncrease);
        socket.off('batchStockDecrease', handleBatchStockDecreasee);
        socket.off('activeProductUpdated', handleActiveProductUpdated);
        socket.off('inactiveProductUpdated', handleInactiveProductUpdated);
        socket.off('updateProductDisplayPriority', handleUpdateProductDisplayPriority);
      };
    }
  }, [socket]);

  function mergeSortedProductArrays(arrA: DressTypes[], arrB: PurseTypes[]) {
    let i = 0,
      j = 0;
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

  async function getProductsData() {
    if (token) {
      try {
        const [activeDresses, activePurses, inactiveDresses, inactivePurses] = await Promise.all([
          fetchData(token, 'products/active-dresses'),
          fetchData(token, 'products/active-purses'),
          fetchData(token, 'products/inactive-dresses'),
          fetchData(token, 'products/inactive-purses'),
        ]);

        setActiveProducts(mergeSortedProductArrays(activeDresses, activePurses));
        setInactiveProducts(mergeSortedProductArrays(inactiveDresses, inactivePurses));
      } catch (error) {
        popupMessage('Došlo je do problema prilikom preuzimanja proizvoda', 'danger');
        betterErrorLog('Error fetching products', error);
      }
    }
  }

  useEffect(() => {
    getProductsData();
    if (!token) {
      setActiveProducts([]);
      setInactiveProducts([]);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      allActiveProducts: activeProducts,
      allInactiveProducts: inactiveProducts,
      allProducts,
      setAllActiveProducts: setActiveProducts,
      setAllInactiveProducts: setInactiveProducts,
      fetchAllProducts: getProductsData,
      productsBySuppliers: productsBySuppliers ?? {},
      productsByCategory: productsByCategory ?? {},
    }),
    [activeProducts, inactiveProducts, allProducts, productsBySuppliers, productsByCategory]
  );

  return <AllProductsContext.Provider value={value}>{children}</AllProductsContext.Provider>;
}

export default AllProductsContextProvider;
