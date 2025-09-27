import { OrderTypes } from '../../types/allTsTypes';

function filterReservations(data: OrderTypes[], searchData: any) {
  const dates = new Set();

  let filtered = data;

  // 1️⃣ Filter by picked date
  if (searchData.pickedDate) {
    filtered = searchReservationsByDate(filtered, searchData.pickedDate);
  }

  // 2️⃣ Filter by text input
  filtered = searchReservationsByInput(filtered, searchData.query);

  // 3️⃣ Filter by size
  if (searchData.onSizeSearch?.length) {
    filtered = filterReservationsBySize(filtered, searchData.onSizeSearch);
  }

  // 4️⃣ Filter by color
  if (searchData.onColorsSearch?.length) {
    filtered = filterReservationsByColor(filtered, searchData.onColorsSearch);
  }

  // 5️⃣ Asd / Desc
  const groupedReservations: { date: string; reservations: OrderTypes[] }[] = [];
  for (const reservation of filtered) {
    if (reservation.reservation && reservation.reservationDate) {
      const dateStr = reservation.reservationDate.toString();
      if (dates.has(dateStr)) {
        const group = groupedReservations.find((g) => g.date === dateStr);
        group?.reservations.push(reservation);
      } else {
        dates.add(dateStr);
        groupedReservations.push({ date: dateStr, reservations: [reservation] });
      }
    }
  }

  // Sort grouped reservations by date
  groupedReservations.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();

    if (searchData.ascending) return timeA - timeB;
    if (searchData.descending) return timeB - timeA;
    return 0;
  });

  return groupedReservations;
}

/* ----------------- helper functions ----------------- */

function searchReservationsByDate(reservations: OrderTypes[], pickedDate: Date) {
  return reservations.filter((item) => {
    return new Date(item.reservationDate).getTime() === new Date(pickedDate).getTime();
  });
}

// ----------------- input filter -----------------
function searchReservationsByInput(reservations: OrderTypes[], searchData: string) {
  const inputData = searchData.toLowerCase();
  return reservations.filter((item) => {
    const { name, address, phone, phone2, place } = item.buyer;
    const { totalPrice } = item;
    return (
      name?.toLowerCase().includes(inputData) ||
      address?.toLowerCase().includes(inputData) ||
      place?.toString().toLowerCase().includes(inputData) ||
      phone.toString().includes(inputData) ||
      phone2?.toString().includes(inputData) ||
      totalPrice.toString().includes(inputData)
    );
  });
}

// ----------------- size filter -----------------
function filterReservationsBySize(reservations: OrderTypes[], searchSizes: string[]) {
  return reservations.filter((reservation) =>
    reservation.products?.some(
      (product: any) =>
        'selectedSize' in product &&
        typeof product.selectedSize === 'string' &&
        searchSizes.includes(product.selectedSize)
    )
  );
}

// ----------------- color filter -----------------
function filterReservationsByColor(reservations: OrderTypes[], searchColors: string[]) {
  return reservations.filter((reservation) =>
    reservation.products?.some(
      (product: any) =>
        'selectedColor' in product &&
        typeof product.selectedColor === 'string' &&
        searchColors.includes(product.selectedColor)
    )
  );
}

export default filterReservations;
