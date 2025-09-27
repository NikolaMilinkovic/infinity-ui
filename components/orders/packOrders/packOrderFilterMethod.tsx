import { OrderTypes } from '../../../types/allTsTypes';

export function filterPackOrders(orders: OrderTypes[], searchParams: any) {
  const filteredViaInput = searchPackOrdersViaInput(orders, searchParams.query);
  function searchPackOrdersViaInput(reservations: OrderTypes[], searchData: string) {
    const inputData = searchData.toLowerCase();

    const inputSearch = reservations.filter((order) => {
      const { name, address, phone, phone2, place } = order.buyer;
      const { totalPrice, courier } = order;
      return (
        name?.toLowerCase().includes(inputData) ||
        address.toLowerCase().includes(inputData) ||
        place?.toString().toLowerCase().includes(inputData) ||
        phone.toString().includes(inputData) ||
        phone2?.toString().includes(inputData) ||
        totalPrice.toString().includes(inputData) ||
        courier?.name?.toLocaleLowerCase().includes(inputData)
      );
    });

    return inputSearch;
  }

  return filteredViaInput;
}
