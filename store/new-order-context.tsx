import { createContext, useState, ReactNode, useMemo, useEffect } from "react";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { ProductTypes } from "../types/allTsTypes";
import { NewOrderContextTypes, BuyerTypes } from "../types/allTsTypes";
interface ContextChildrenTypes {
  children: ReactNode;
}

export const NewOrderContext = createContext<NewOrderContextTypes>({
  productData: [],
  addProduct: () => {},
  removeProduct: () => {},
  setProductsData: () => {},
  getProductsData: () => [],

  buyerData: null,
  setBuyerData: () => {},
  getBuyerData: () => null,
  resetOrderData: () => null
})

function NewOrderContextProvider({ children }: ContextChildrenTypes){
  const [productData, setProductData] = useState<ProductTypes[]>([]);
  const [buyerData, setBuyerData] = useState<BuyerTypes | null>(null);
  const [orderedProductsData, setOrderProductsData] = useState([]); 

  useEffect(() => {
    betterConsoleLog('> Logging product data: ', productData.length);
  }, [productData])

  useEffect(() => {
    betterConsoleLog('> Loggin buyer data: ', buyerData);
  }, [buyerData])

  const setProductsDataHandler = (productsArr: ProductTypes[]) => {
    setProductData(productsArr);
  }
  const addProductHandler = (product: ProductTypes) => {
    setProductData((prev) => [...prev, product]);
  }
  const removeProductByIndexHandler = (index: number) => {
    setProductData((prev) => prev.filter((_, i) => i !== index));
  };
  const getProductsDataHandler = () => {
    return productData;
  }

  const setBuyerDataHandler = (data:BuyerTypes) => {
    setBuyerData(data);
  }
  const getBuyerDataHandler = () => {
    return buyerData;
  }

  const resetOrderDataHandler = () => {
    setProductData([]);
    setBuyerData(null);
  }

  const value = useMemo(() => ({
    productData,
    addProduct: addProductHandler,
    removeProduct: removeProductByIndexHandler,
    setProductsData: setProductsDataHandler,
    getProductsData: getProductsDataHandler,
    buyerData,
    setBuyerData: setBuyerDataHandler,
    getBuyerData: getBuyerDataHandler,
    resetOrderData: resetOrderDataHandler
  }), [productData, buyerData]);

  return <NewOrderContext.Provider value={value}>{ children }</NewOrderContext.Provider>
}

export default NewOrderContextProvider;