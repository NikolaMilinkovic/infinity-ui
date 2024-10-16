import { betterConsoleLog } from "./LogMethods";

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
type ProductType = DressType | PurseType;
interface SearchParamsType {
  isOnStock: boolean
  isNotOnStock: boolean
  onStockAndSoldOut: boolean
  onCategorySearch: string
  onColorsSearch: string[]
  onSizeSearch: string[]
}

export function serachProducts(searchData: string, allActiveProducts: ProductType[], searchParams: SearchParamsType){
  if(allActiveProducts === undefined) return [];
  if(allActiveProducts.length === 0) return [];
  // Search items by Name
  let nameBasedSearch = allActiveProducts;
  if(searchData){
    nameBasedSearch = searchItemsByName(allActiveProducts, searchData);
  }

  // Filter by categories
  let categoriesBasedSearch = nameBasedSearch;
  if(searchParams.onCategorySearch){
    console.log(searchParams.onCategorySearch);
    categoriesBasedSearch = filterByCategories(nameBasedSearch, searchParams.onCategorySearch)
  }

  // Filter by color
  let colorBasedSearch = categoriesBasedSearch;
  if(searchParams.onColorsSearch.length > 0){
    colorBasedSearch = filterByColor(nameBasedSearch, searchParams.onColorsSearch);
  }

  // Filter by availability [on stock & sold out]
  let stockFilteredResults = colorBasedSearch
  if(colorBasedSearch.length > 0){
    stockFilteredResults = colorBasedSearch.filter((result: ProductType) => {
      if(searchParams.onStockAndSoldOut) return true
      if(searchParams.isOnStock) return showItemsOnStock(result)
      if(searchParams.isNotOnStock) return showItemsNotOnStock(result)
  
      return true;
    });
  }

  // Filter by size available stock
  let sizeFilteredResults = stockFilteredResults
  if(stockFilteredResults.length > 0){
    sizeFilteredResults = stockFilteredResults.filter((result: ProductType) => {
      if(searchParams.onSizeSearch.length > 0){
        return searchItemsBySize(result, searchParams.onSizeSearch);
      }
      return true;
    })
  }
  
  return sizeFilteredResults;
}

// Search by inserted name compares inserted query with [Item Name, Item Colors]
export function searchItemsByName(allActiveProducts: any, searchData: string){
  const nameBasedSearch = allActiveProducts.filter((item: ProductType) =>
    item.name.toLowerCase().includes(searchData.toLowerCase())
  )
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) => 
      colorObj.color.toLowerCase().includes(searchData.toLowerCase())
    )
  );
  return [...new Set([...nameBasedSearch, ...colorBasedSearch])];
}

// FILTER FOR ITEMS ON STOCK
export function showItemsOnStock(result: ProductType) {

  // PURSES 
  if (result.category === 'Haljina') {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeType) => sizeObj.stock > 0)
    );
 
  // DRESSES
  } else if (result.category === 'Torbica') {
    return result.colors.some((colorObj: any) => colorObj.stock > 0);

  // REST
  } else {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeType) => sizeObj.stock > 0)
    );
  }
}

// FILTER FOR ITEMS NOT ON STOCK
export function showItemsNotOnStock(result: ProductType) {

// PURSES 
if (result.category === 'Haljina') {
  return result.colors.every((colorObj: any) =>
    colorObj.sizes.every((sizeObj: ColorSizeType) => sizeObj.stock === 0)
  );

// DRESSES
} else if (result.category === 'Torbica') {
  return result.colors.every((colorObj: any) => colorObj.stock === 0);

// REST
} else {
  return result.colors.every((colorObj: any) =>
    colorObj.sizes.every((sizeObj: ColorSizeType) => sizeObj.stock === 0)
  );
}
}

// FILTER FOR ITEMS ON CATEGORY
export function filterByCategories(allActiveProducts:any, category:string){
  const categoriesBasedSearch = allActiveProducts.filter((item: any) => 
    item.category === category
  )
  return categoriesBasedSearch;
}

// METHOD FOR FILTERING BY COLOR
export function filterByColor(allActiveProducts: any, searchData: string[]) {
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) =>
      searchData.some((searchColor) =>
        colorObj.color.toLowerCase().includes(searchColor.toLowerCase())
      )
    )
  );
  return colorBasedSearch;
}

// METHOD FOR FILTERING BY ITEMS SIZES THAT ARE ON STOCK
function searchItemsBySize(product: ProductType, searchSizes: string[]): boolean {
  if ('sizes' in product.colors[0]) {
    const matches =  product.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeType) => 
        searchSizes.includes(sizeObj.size) && sizeObj.stock > 0
      )
    );
    betterConsoleLog('> Matches with UNI are', matches);
    return matches
  }
  return false;
}