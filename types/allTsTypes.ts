// IMAGE PICKER => TAKEN IMAGE DATA TYPES
export interface ProductImageTypes {
  assetId: string | null;
  base64: string | null;
  duration: number | null;
  exif: object | null;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  rotation: number | null;
  type: string;
  uri: string;
  width: number;
}

// CATEGORIES
export interface CategoryTypes {
  _id: string
  name: string
}

// COLORS
export interface ColorTypes {
  _id: string
  name: string
  colorCode: string
}

// Search product component => Search Params object
export interface SearchParamsTypes {
  isOnStock: boolean
  isNotOnStock: boolean
  onStockAndSoldOut: boolean
  onCategorySearch: string
  onColorsSearch: string[]
  onSizeSearch: string[]
}


// DRESSES
export interface ColorSizeTypes {
  size: string;
  stock: number;
  _id: string;
}
export interface ImageTypes {
  uri: string;
  imageName: string;
}
export interface DressColorTypes {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeTypes[];
}
export interface DressTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: DressColorTypes[];
  image: ImageTypes;
}

// PURSES
export interface PurseColorTypes{
  _id: string
  color: string
  colorCode: string
  stock: number 
}
export interface PurseTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  price: number;
  colors: PurseColorTypes[];
  image: ImageTypes;
}

// PURSE & DRESS TYPE
export type ProductTypes = DressTypes | PurseTypes;


// NEW ORDER CONTEXT
export interface BuyerTypes {
  name: string
  address: string
  phone: string
}
export interface OrderProductTypes {
  itemReference: ProductTypes;
  selectedColor: string;
  selectedSize: string;
  productType: string;
  quantity: number;
}
export interface NewOrderContextTypes {
  productReferences: ProductTypes[];
  addProductReference: (product: ProductTypes) => void;
  removeProductReference: (index: number) => void;
  setProductReferences: (products: ProductTypes[]) => void;
  getProductReferences: () => ProductTypes[];

  productData: OrderProductTypes[];
  addProduct: (product: OrderProductTypes) => void;
  removeProduct: (index: number) => void;
  setProductsData: (products: OrderProductTypes[]) => void;
  getProductsData: () => OrderProductTypes[];
  updateProductColorByIndex: (index: number, selectedColor: string) => void;
  updateProductSizeByIndex: (index: number, selectedSize: string) => void;

  buyerData: BuyerTypes | null;
  setBuyerData: (info: BuyerTypes) => void;
  getBuyerData: () => BuyerTypes | null;
  resetOrderData: () => void;
}

export interface CourierTypes {
  _id: string
  name: string
}