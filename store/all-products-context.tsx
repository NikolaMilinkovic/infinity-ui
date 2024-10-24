import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { DressesContext } from "./dresses-context";
import { PursesContext } from "./purses-context";
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { DressTypes, PurseTypes } from "../types/allTsTypes";
import { popupMessage } from "../util-components/PopupMessage";
import { decreaseDressStock, decreasePurseStock } from "../util-methods/StockMethods";


interface AllProductsContextType {
  allActiveProducts: (DressTypes | PurseTypes)[];
  allInactiveProducts: (DressTypes | PurseTypes)[];
  allProducts: (DressTypes | PurseTypes)[];
  setAllActiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
  setAllInactiveProducts: (products: (DressTypes | PurseTypes)[]) => void;
  setAllProducts: (products: (DressTypes | PurseTypes)[]) => void;
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
})

function AllProductsContextProvider({ children }: AllProductsProviderType){
  const [activeProducts, setActiveProducts] = useState<(DressTypes | PurseTypes)[]>([])
  const [inactiveProducts, setInactiveProducts] = useState<(DressTypes | PurseTypes)[]>([])
  const [allProducts, setAllProducts] = useState<(DressTypes | PurseTypes)[]>([])

  const authCtx = useContext(AuthContext)
  const token = authCtx.token
  const socketCtx = useContext(SocketContext)
  const socket = socketCtx?.socket

  // SOCKET METHODS
  function activeProductAddedHandler(newProduct: DressTypes | PurseTypes){
    setActiveProducts(prev => [...prev, newProduct]);
  }
  function inactiveProductAddedHandler(newProduct: DressTypes | PurseTypes){
    setInactiveProducts(prev => [...prev, newProduct]);
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
            setActiveProducts(prevActive => [...prevActive, movedProduct]);
            return updatedInactiveProducts;
        }
        return prevInactive;
    });
  }
  function handleStockDecrease(data: any){
    if(!data.stockType) return popupMessage('Update stanja nije uspeo, stockType je obavezan!', 'danger');
    if(data.stockType === 'Boja-Veličina-Količina'){
      decreaseDressStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<DressTypes[]>>)
    }
    if(data.stockType === 'Boja-Količina'){
      decreasePurseStock(data, setActiveProducts as React.Dispatch<React.SetStateAction<PurseTypes[]>>)
    }
  }
  // Handle setting ALL PRODUCTS
  useEffect(() => {
    setAllProducts([...activeProducts, ...inactiveProducts]);
  }, [activeProducts, inactiveProducts]);

  useEffect(() => {
    if(socket){
      socket.on('activeProductAdded', activeProductAddedHandler);
      socket.on('inactiveProductAdded', inactiveProductAddedHandler);
      socket.on('activeProductRemoved', activeProductRemovedHandler);
      socket.on('inactiveProductRemoved', inactiveProductRemovedHandler);
      socket.on('activeToInactive', activeToInactive);
      socket.on('inactiveToActive', inactiveToActive);
      socket.on('allProductStockDecrease', handleStockDecrease);

      return () => {
        socket.off('activeProductAdded');
        socket.off('inactiveProductAdded');
        socket.off('activeProductRemoved');
        socket.off('inactiveProductRemoved');
        socket.off('activeToInactive');
        socket.off('inactiveToActive');
        socket.off('allProductStockDecrease');
      };
    }
  },[socket])

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
  
          setActiveProducts([...activeDresses, ...activePurses]);
          setInactiveProducts([...inactiveDresses, ...inactivePurses]);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    }
    getProductsData();
  }, [token]);

  // Memoizing the getters
  const value = useMemo(() => ({
    allActiveProducts: activeProducts,
    allInactiveProducts: inactiveProducts,
    allProducts,
    setAllActiveProducts: setActiveProducts,
    setAllInactiveProducts: setInactiveProducts,
    setAllProducts,
  }), [activeProducts, inactiveProducts, allProducts]);

  return <AllProductsContext.Provider value={value}>{children}</AllProductsContext.Provider>;
}

export default AllProductsContextProvider