import { createContext, useState, ReactNode, useMemo, useEffect } from "react";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { NewOrderContextTypes, BuyerTypes, ProductTypes, OrderProductTypes, CourierTypes } from "../types/allTsTypes";
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
  resetOrderData: () => null,

  courierData: null,
  setCourierData: () => {},
  getCourierData: () => null,

  isReservation: false,
  setIsReservation: () => {}
})

function NewOrderContextProvider({ children }: ContextChildrenTypes){
  const [productReferences, setProductReferences] = useState<ProductTypes[]>([]);
  const [buyerData, setBuyerData] = useState<BuyerTypes | null>(null);
  const [productData, setProductData] = useState<OrderProductTypes[]>([]);
  const [courierData, setCourierData] = useState<CourierTypes>(undefined);
  const [isReservation, setIsReservation] = useState(false);

  // useEffect(() => {
  //   betterConsoleLog('> Logging product references: ', productReferences.length);
  // }, [productReferences])

  useEffect(() => {
    betterConsoleLog('> Logging product data: ', productData.length);
  }, [productData])

  // useEffect(() => {
  //   betterConsoleLog('> Loggin buyer data: ', buyerData);
  // }, [buyerData])

  // PRODUCT REFERENCE => References of selected items
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

  // COURIER
  function setCourierDataHandler(courierData:CourierTypes){
    setCourierData(courierData)
  }
  function getCourierDataHandler(){
    return courierData;
  }
  useEffect(() => {
    betterConsoleLog('> Logging out courier data from new order context', courierData);
  }, [courierData])

  useEffect(() => {
    console.log('> isReservation: ', isReservation);
  }, [isReservation])

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

    courierData,
    setCourierData: setCourierDataHandler,
    getCourierData: getCourierDataHandler,

    isReservation,
    setIsReservation: setIsReservation,
    
    resetOrderData: resetOrderDataHandler
  }), [productData, buyerData, productReferences, courierData, isReservation]);

  return <NewOrderContext.Provider value={value}>{ children }</NewOrderContext.Provider>
}

export default NewOrderContextProvider;