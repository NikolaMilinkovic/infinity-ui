import { OrderTypes } from "../types/allTsTypes"

interface ReservationsSearchParams {
  ascending: boolean
  descending: boolean
}
export function searchReservations(searchData: string, orders:OrderTypes[], searchParams:ReservationsSearchParams){
  if(orders === undefined || orders.length === 0) return [];
  const reservations = orders.filter((item) => item.reservation === true);

  let inputBasedSearch = reservations;
  if(searchData){
    inputBasedSearch = searchReservationsByInput(reservations, searchData);
  }
  let ascendingDescendingDataDisplay = ascDescDataDisplay(inputBasedSearch, searchParams);

  return ascendingDescendingDataDisplay;
}

function ascDescDataDisplay(reservations:OrderTypes[], searchParams:ReservationsSearchParams){
  const { ascending, descending } = searchParams;
  if(ascending) return reservations;
  if(descending) return reservations.reverse();
}

function searchReservationsByInput(reservations:OrderTypes[], searchData:string){
  const inputData = searchData.toLowerCase();

  const inputSearch = reservations.filter((item) => {
    const { name, address, phone, phone2, place } = item.buyer;
    const { totalPrice } = item;
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