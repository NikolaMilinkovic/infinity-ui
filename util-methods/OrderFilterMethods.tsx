import { OrderTypes } from '../types/allTsTypes';
import normalizeText from './text/NormalizeText';

interface OrderSearchParams {
  processed: boolean;
  unprocessed: boolean;
  packed: boolean;
  unpacked: boolean;
  packedAndUnpacked: boolean;
  onCourierSearch: string;
  ascending: boolean;
  descending: boolean;
  onColorsSearch: string[];
  onSizeSearch: string[];
}

export function searchOrders(searchData: string, orders: OrderTypes[], searchParams: OrderSearchParams): OrderTypes[] {
  if (!orders || orders.length === 0) return [];

  let result = orders.filter((o) => o.reservation === false);

  if (searchData) result = searchOrdersByInput(result, searchData);

  result = filterOrdersByProcessed(result, searchParams);
  result = filterOrdersByPackedState(result, searchParams);

  if (searchParams.onCourierSearch) {
    result = filterOrderByCourier(result, searchParams.onCourierSearch);
  }

  result = ascDescDataDisplay(result, searchParams);
  result = filterOrdersByProductSize(result, searchParams.onSizeSearch);
  result = filterOrdersByProductColor(result, searchParams.onColorsSearch);

  return result;
}

function ascDescDataDisplay(orders: OrderTypes[], searchParams: OrderSearchParams): OrderTypes[] {
  const { ascending, descending } = searchParams;
  if (descending) return orders.slice().reverse(); // don't mutate original
  return orders; // default / ascending -> keep order
}

function searchOrdersByInput(orders: OrderTypes[], searchData: string): OrderTypes[] {
  const inputData = normalizeText(searchData);
  return orders.filter((order) => {
    const { phone, phone2 } = order.buyer;
    const name = normalizeText(order.buyer.name);
    const address = normalizeText(order.buyer.address);
    const place = normalizeText(order.buyer.place);
    const { totalPrice } = order;

    return (
      name?.includes(inputData) ||
      address?.includes(inputData) ||
      place?.toString().includes(inputData) ||
      phone?.toString().includes(inputData) ||
      phone2?.toString().includes(inputData) ||
      totalPrice?.toString().includes(inputData)
    );
  });
}

function filterOrdersByProcessed(orders: OrderTypes[], searchParams: OrderSearchParams): OrderTypes[] {
  const { processed, unprocessed } = searchParams;
  // if both toggles are the same (both true or both false) -> no filter
  if (processed === unprocessed) return orders;
  return processed ? orders.filter((o) => o.processed) : orders.filter((o) => !o.processed);
}

function filterOrdersByPackedState(orders: OrderTypes[], searchParams: OrderSearchParams): OrderTypes[] {
  const { packed, unpacked, packedAndUnpacked } = searchParams;
  if (packedAndUnpacked) return orders;
  if (packed === unpacked) return orders;
  return packed ? orders.filter((o) => o.packed) : orders.filter((o) => !o.packed);
}

function filterOrderByCourier(orders: OrderTypes[], courierName: string): OrderTypes[] {
  if (!courierName) return orders;
  return orders.filter((o) => o.courier?.name === courierName);
}

/* ---- size filter fixes ----
   - Accepts an array of orders and returns filtered orders.
   - Uses a type-guard so TS won't complain for products without `selectedSize`.
*/
function hasSelectedSize(product: any): product is { selectedSize: string } {
  return (
    product && typeof product === 'object' && 'selectedSize' in product && typeof product.selectedSize === 'string'
  );
}

function filterOrdersByProductSize(orders: OrderTypes[], searchSizes?: string[]): OrderTypes[] {
  if (!searchSizes || searchSizes.length === 0) return orders; // no size filter -> keep all
  return orders.filter((order) =>
    order.products?.some((product: any) => hasSelectedSize(product) && searchSizes.includes(product.selectedSize))
  );
}

function filterOrdersByProductColor(orders: OrderTypes[], searchColors?: string[]): OrderTypes[] {
  if (!searchColors || searchColors.length === 0) return orders; // no filter -> keep all

  return orders.filter((order) =>
    order.products?.some(
      (product: any) => typeof product.selectedColor === 'string' && searchColors.includes(product.selectedColor)
    )
  );
}

// export function searchOrders(searchData: string, orders: OrderTypes[], searchParams: OrderSearchParams) {
//   if (orders === undefined || orders.length === 0) return [];
//   const excludedReservations = orders.filter((order) => order.reservation === false);

//   let inputBasedSearch = excludedReservations;
//   if (searchData) {
//     inputBasedSearch = searchOrdersByInput(excludedReservations, searchData);
//   }

//   let processedBasedSearch = filterOrdersByProcessed(inputBasedSearch, searchParams);
//   let packedBasedSearch = filterOrdersByPackedState(processedBasedSearch, searchParams);
//   let courierBasedSearch = packedBasedSearch;
//   if (searchParams.onCourierSearch) {
//     courierBasedSearch = filterOrderByCourier(packedBasedSearch, searchParams);
//   }
//   let ascendingDescendingDataDisplay = ascDescDataDisplay(courierBasedSearch, searchParams);

//   let sizeFilteredOrders = filterOrdersByProductSize(ascendingDescendingDataDisplay, searchParams.onSizeSearch);

//   return sizeFilteredOrders;
// }

// function ascDescDataDisplay(orders: OrderTypes[], searchParams: OrderSearchParams) {
//   const { ascending, descending } = searchParams;
//   if (ascending) return orders;
//   if (descending) return orders.reverse();
// }

// function searchOrdersByInput(orders: OrderTypes[], searchData: string) {
//   const inputData = searchData.toLowerCase();

//   const inputSearch = orders.filter((order) => {
//     const { name, address, phone, place, phone2 } = order.buyer;
//     const { totalPrice } = order;

//     return (
//       name?.toLowerCase().includes(inputData) ||
//       address.toLowerCase().includes(inputData) ||
//       place?.toString().toLowerCase().includes(inputData) ||
//       phone.toString().includes(inputData) ||
//       phone2?.toString().includes(inputData) ||
//       totalPrice.toString().includes(inputData)
//     );
//   });

//   return inputSearch;
// }
// function filterOrdersByProcessed(orders: OrderTypes[], searchParams: OrderSearchParams) {
//   const { processed, unprocessed } = searchParams;
//   const processedFilter = orders.filter((order) => {
//     if (processed && order.processed) return order;
//     if (unprocessed && !order.processed) return order;
//   });
//   return processedFilter;
// }
// function filterOrdersByPackedState(orders: OrderTypes[], searchParams: OrderSearchParams) {
//   const { packed, unpacked, packedAndUnpacked } = searchParams;
//   if (packedAndUnpacked) return orders;
//   const processedFilter = orders.filter((order) => {
//     if (packed && order.packed) return order;
//     if (unpacked && !order.packed) return order;
//   });
//   return processedFilter;
// }
// function filterOrderByCourier(orders: OrderTypes[], searchParams: OrderSearchParams) {
//   const { onCourierSearch } = searchParams;
//   const processedFilter = orders.filter((order) => order.courier?.name === onCourierSearch);
//   return processedFilter;
// }
// // If order has that size in its products it will show it
// function hasSelectedSize(product: any): product is { selectedSize: string } {
//   return (
//     product && typeof product === 'object' && 'selectedSize' in product && typeof product.selectedSize === 'string'
//   );
// }
// function filterOrdersByProductSize(orders: OrderTypes[], searchSizes?: string[]): OrderTypes[] {
//   if (!searchSizes || searchSizes.length === 0) return orders; // no size filter -> keep all
//   return orders.filter((order) =>
//     order.products?.some((product: any) => hasSelectedSize(product) && searchSizes.includes(product.selectedSize))
//   );
// }
