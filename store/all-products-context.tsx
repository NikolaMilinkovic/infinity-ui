import { createContext, useEffect, useState, ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import { DressesContext } from "./dresses-context";
import { PursesContext } from "./purses-context";
import isEqual from 'lodash/isEqual';
import { fetchData } from "../util-methods/FetchMethods";
import { betterConsoleLog } from "../util-methods/LogMethods";

interface ColorSizeType {
  size: string;
  stock: number;
  _id: string;
}
interface DressColorType {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeType[];
}
interface DressType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: DressColorType[];
}
interface PurseColorType {
  _id: string;
  color: string;
  colorCode: string;
  stock: number;
}
interface PurseType {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: PurseColorType[];
}
interface AllProductsContextType {
  allActiveProducts: (DressType | PurseType)[];
  allInactiveProducts: (DressType | PurseType)[];
  allProducts: (DressType | PurseType)[];
  setAllActiveProducts: (products: (DressType | PurseType)[]) => void;
  setAllInactiveProducts: (products: (DressType | PurseType)[]) => void;
  setAllProducts: (products: (DressType | PurseType)[]) => void;
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
  const [activeProducts, setActiveProducts] = useState<(DressType | PurseType)[]>([])
  const [inactiveProducts, setInactiveProducts] = useState<(DressType | PurseType)[]>([])
  const [allProducts, setAllProducts] = useState<(DressType | PurseType)[]>([])

  const authCtx = useContext(AuthContext)
  const token = authCtx.token
  const socketCtx = useContext(SocketContext)
  const socket = socketCtx?.socket
  const dressesCtx = useContext(DressesContext);
  const pursesCtx = useContext(PursesContext);

  // Setters
  const setActiveProductsHandler = (products: (DressType | PurseType)[]) => {
    setActiveProducts(products);
  };
  const setInactiveProductsHandler = (products: (DressType | PurseType)[]) => {
    setInactiveProducts(products);
  };
  const setAllProductsHandler = (products: (DressType | PurseType)[]) => {
    setAllProducts(products);
  };

  // Getters with memoization
  const getAllActiveProductsHandler = () => activeProducts;
  const getAllInactiveProductsHandler = () => inactiveProducts;
  const getAllProductsHandler = () => allProducts;

  // SOCKET METHODS
  function activeProductAddedHandler(newProduct: DressType | PurseType){
    betterConsoleLog('> Socket adding new product in All Products Context', newProduct);
    setActiveProducts(prev => [...prev, newProduct]);
  }
  function inactiveProductAddedHandler(newProduct: DressType | PurseType){
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

      return () => {
        socket.off('activeProductAdded');
        socket.off('inactiveProductAdded');
        socket.off('activeProductRemoved');
        socket.off('inactiveProductRemoved');
        socket.off('activeToInactive');
        socket.off('inactiveToActive');
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