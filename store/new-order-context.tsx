import { createContext, useState, ReactNode, useMemo, useEffect } from "react";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { NewOrderContextTypes, BuyerTypes, ProductTypes, OrderProductTypes } from "../types/allTsTypes";
interface ContextChildrenTypes {
  children: ReactNode;
}

export const NewOrderContext = createContext<NewOrderContextTypes>({
  productReferences: [],
  addProductReference: () => {},
  removeProductReference: () => {},
  setProductReferences: () => {},
  getProductReferences: () => [],
  updateProductColorByIndex: () => [],
  updateProductSizeByIndex: () => [],

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
  const [productReferences, setProductReferences] = useState<ProductTypes[]>([]);
  const [buyerData, setBuyerData] = useState<BuyerTypes | null>(null);
  const [productData, setProductData] = useState<OrderProductTypes[]>([]);

  useEffect(() => {
    betterConsoleLog('> Logging product references: ', productReferences.length);
  }, [productReferences])

  useEffect(() => {
    betterConsoleLog('> Logging product data: ', productData.length);
  }, [productData])

  useEffect(() => {
    betterConsoleLog('> Loggin buyer data: ', buyerData);
  }, [buyerData])

  // PRODUCT REFERENCE
  const setProductReferencesHandler = (productsArr: ProductTypes[]) => {
    setProductReferences(productsArr);
  }
  const addProductReferenceHandler = (product: ProductTypes) => {
    setProductReferences((prev) => [...prev, product]);
  }
  const removeProductReferenceByIndexHandler = (index: number) => {
    setProductReferences((prev) => prev.filter((_, i) => i !== index));
  };
  const getProductReferencesDataHandler = () => {
    return productReferences;
  }

  // PRODUCTS
  const setProductsDataHandler = (productsArr: OrderProductTypes[]) => {
    setProductData(productsArr);
  }
  const addProductHandler = (product: OrderProductTypes) => {
    setProductData((prev) => [...prev, product]);
  }
  const removeProductByIndexHandler = (index: number) => {
    setProductData((prev) => prev.filter((_, i) => i !== index));
  };
  const getProductsDataHandler = () => {
    return productData;
  }
  const updateProductColorByIndexHandler = (index: number, selectedColor: string) => {
    setProductData((prev) => {
      const updatedProducts = [...prev]; // Clone the array
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],  // Keep other product fields
          selectedColor: selectedColor,
        };
      }
      return updatedProducts;
    });
  };
  const updateProductSizeByIndexHandler = (index: number, selectedSize: string) => {
    setProductData((prev) => {
      const updatedProducts = [...prev]; // Clone the array
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],  // Keep other product fields
          selectedSize: selectedSize,
        };
      }
      return updatedProducts;
    });
  };

  // BUYER
  const setBuyerDataHandler = (data:BuyerTypes) => {
    setBuyerData(data);
  }
  const getBuyerDataHandler = () => {
    return buyerData;
  }

  const resetOrderDataHandler = () => {
    setProductReferences([]);
    setProductData([]);
    setBuyerData({
      name: '',
      address: '',
      phone: '',
    });
  }

  useEffect(() => {
    betterConsoleLog('> Product data is: ', productData);
  }, [productData])

  const value = useMemo(() => ({
    productReferences,
    setProductReferences: setProductReferencesHandler,
    addProductReference: addProductReferenceHandler,
    removeProductReference: removeProductReferenceByIndexHandler,
    getProductReferences: getProductReferencesDataHandler,
    
    productData,
    addProduct: addProductHandler,
    removeProduct: removeProductByIndexHandler,
    setProductsData: setProductsDataHandler,
    getProductsData: getProductsDataHandler,
    updateProductColorByIndex: updateProductColorByIndexHandler,
    updateProductSizeByIndex: updateProductSizeByIndexHandler,

    buyerData,
    setBuyerData: setBuyerDataHandler,
    getBuyerData: getBuyerDataHandler,
    
    resetOrderData: resetOrderDataHandler
  }), [productData, buyerData, productReferences]);

  return <NewOrderContext.Provider value={value}>{ children }</NewOrderContext.Provider>
}

export default NewOrderContextProvider;