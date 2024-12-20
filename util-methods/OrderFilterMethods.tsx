import { OrderTypes, SearchParamsTypes } from "../types/allTsTypes"

interface OrderSearchParams {
  processed: boolean
  unprocessed: boolean
  packed: boolean
  unpacked: boolean
  packedAndUnpacked: boolean
  onCourierSearch: string
  ascending: boolean
  descending: boolean
}
export function searchOrders(searchData: string, orders:OrderTypes[], searchParams:OrderSearchParams){
  if(orders === undefined || orders.length === 0) return [];
  const excludedReservations = orders.filter((order) => order.reservation === false);

  let inputBasedSearch = excludedReservations;
  if(searchData){
    inputBasedSearch = searchOrdersByInput(excludedReservations, searchData);
  }

  let processedBasedSearch = filterOrdersByProcessed(inputBasedSearch, searchParams);
  let packedBasedSearch = filterOrdersByPackedState(processedBasedSearch, searchParams);
  let courierBasedSearch = packedBasedSearch;
  if(searchParams.onCourierSearch){
    courierBasedSearch = filterOrderByCourier(packedBasedSearch, searchParams);
  }
  let ascendingDescendingDataDisplay = ascDescDataDisplay(courierBasedSearch, searchParams);


  return ascendingDescendingDataDisplay;
}

function ascDescDataDisplay(orders:OrderTypes[], searchParams:OrderSearchParams){
  const { ascending, descending } = searchParams;
  if(ascending) return orders;
  if(descending) return orders.reverse();
}


function searchOrdersByInput(orders:OrderTypes[], searchData:string){
  const inputData = searchData.toLowerCase();

  const inputSearch = orders.filter((order) => {
    const { name, address, phone, place, phone2 } = order.buyer;
    const { totalPrice } = order;

    return (
      name?.toLowerCase().includes(inputData) ||
      address.toLowerCase().includes(inputData) ||
      place?.toString().toLowerCase().includes(inputData) ||
      phone.toString().includes(inputData) ||
      phone2?.toString().includes(inputData) ||
      totalPrice.toString().includes(inputData)
    )
  })

  return inputSearch;
}
function filterOrdersByProcessed(orders:OrderTypes[], searchParams:OrderSearchParams ){
  const { processed, unprocessed } = searchParams;
  const processedFilter = orders.filter((order) => {
    if(processed && order.processed) return order;
    if(unprocessed && !order.processed) return order;
  })
  return processedFilter;
}
function filterOrdersByPackedState(orders:OrderTypes[], searchParams:OrderSearchParams){
  const { packed, unpacked, packedAndUnpacked } = searchParams;
  if(packedAndUnpacked) return orders
  const processedFilter = orders.filter((order) => {
    if(packed && order.packed) return order;
    if(unpacked && !order.packed) return order;
  })
  return processedFilter;
}
function filterOrderByCourier(orders:OrderTypes[], searchParams:OrderSearchParams){
  const { onCourierSearch } = searchParams;
  const processedFilter = orders.filter((order) => order.courier?.name === onCourierSearch);
  return processedFilter;
}