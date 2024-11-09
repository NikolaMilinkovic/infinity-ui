import { OrderTypes } from "../types/allTsTypes"

interface ReservationsSearchParams {
  ascending: boolean
  descending: boolean
}
export function searchReservations(searchData: string, reservations:OrderTypes[], searchParams:ReservationsSearchParams){
  if(reservations === undefined || reservations.length === 0) return [];
  const includedReservations = reservations.filter((item) => item.reservation === true);

  let inputBasedSearch = includedReservations;
  if(searchData){
    inputBasedSearch = searchReservationsByInput(includedReservations, searchData);
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
    const { name, address, phone } = item.buyer;
    const { totalPrice } = item;

    return (
      name.toLowerCase().includes(inputData) ||
      address.toLowerCase().includes(inputData) ||
      phone.toString().includes(inputData) ||
      totalPrice.toString().includes(inputData)
    )
  })

  return inputSearch;
}