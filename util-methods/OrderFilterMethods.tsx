import { OrderTypes } from "../types/allTsTypes"

interface OrderSearchParams {
  processed: boolean
  unprocessed: boolean
  packed: boolean
  unpacked: boolean
}
export function searchOrders(searchData: string, orders:OrderTypes[], searchPara:OrderSearchParams){
  if(orders === undefined || orders.length === 0) return [];

  let inputBasedSearch = orders;
  if(searchData){
    inputBasedSearch = searchOrdersByInput(orders, searchData);
  }

  return inputBasedSearch;
}


function searchOrdersByInput(orders:OrderTypes[], searchData:string){
  const inputSearch = orders.filter((order) => {
    const inputData = searchData.toLowerCase();
    const { name, address, phone } = order.buyer;

    return (
      name.toLowerCase().includes(inputData) ||
      address.toLowerCase().includes(inputData) ||
      phone.toString().includes(inputData)
    )
  })

  return inputSearch;
}