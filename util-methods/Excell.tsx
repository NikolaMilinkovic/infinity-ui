import * as XLSX from 'xlsx';
import { OrderTypes } from '../types/allTsTypes';
import { getCurrentDate } from './DateFormatters';

// Adjust column widths to fit the content | Thank you chatGPT :)
const adjustCellsWidth = (ws: XLSX.WorkSheet): void => {
  if (!ws['!ref']) {
    throw new Error("Worksheet reference ('!ref') is missing.");
  }

  const range = XLSX.utils.decode_range(ws['!ref']); // Get the range of the sheet
  const maxColumnLengths = [];

  // Loop through all columns
  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxLength = 0;
    // Loop through all rows in the column
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = { c: col, r: row }; // Address of the cell
      const cell = ws[XLSX.utils.encode_cell(cellAddress)];
      if (cell && cell.v) {
        const columnLength = cell.v.toString().length;
        maxLength = Math.max(maxLength, columnLength);
      }
    }
    // Set the column width, with a minimum of 10
    maxColumnLengths.push({ wch: maxLength < 10 ? 10 : maxLength });
  }

  // Set the column widths
  ws['!cols'] = maxColumnLengths;
};

/**
 * Creates an excell file with all the neccessary data that courier expects
 * @param orders - OrderTypes[] - Array of orders
 * @returns - Object that contains
 * {
 *   "fileName": string,
 *   "fileData": base64
 * }
 */
export const generateExcellForOrders = (orders: OrderTypes[], courier?: string) => {
  const filteredByCreationTime = sortOrdersByDate(orders);
  let allOrdersData = [];
  let index = 1;
  for (const order of filteredByCreationTime) {
    const orderData = [];
    orderData.push(order.buyer?.name.toUpperCase() || ''); // Ime i prezime
    orderData.push(order.buyer?.address.toUpperCase() || ''); // Adresa
    orderData.push(order.buyer?.place.toUpperCase() || ''); // Mesto
    orderData.push(''); // Ptt
    orderData.push(order.buyer?.phone || order.buyer?.phone2 || ''); // Telefon
    // orderData.push( || ''); // Telefon 2
    orderData.push(order?.weight || '1'); // Tezina
    orderData.push('1'); // Br paketa
    orderData.push(order?.totalPrice || ''); // Otkup
    // orderData.push(order?.value || ''); // Vrednost
    orderData.push(order?.buyer.bankNumber || ''); // Ziro racun
    orderData.push('1'); // Postarina
    orderData.push(order?.internalRemark || ''); // Inerna napomena
    orderData.push(order?.deliveryRemark || ''); // Napomena za dostavu
    // orderData.push('0'); // Lično uručenje
    // orderData.push('0'); // Otpremnica
    // orderData.push('0'); // Povratnica
    // orderData.push('0'); // Placen odgovor
    // orderData.push('0'); // Pravno lice
    index += 1;
    allOrdersData.push(orderData);
  }
  let currentDate = getCurrentDate('-');
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.aoa_to_sheet([
    [
      'ime i prezime',
      'adresa',
      'mesto',
      'ptt',
      'telefon',
      // 'telefon 2',
      'težina',
      'broj paketa',
      'otkup',
      // 'vrednost',
      'žiro račun',
      'poštarina',
      'interna napomena',
      'napomena za dostavu',
      // 'lično uručenje',
      // 'otpremnica',
      // 'povratnica',
      // 'plaćen odgovor',
      // 'pravno lice',
    ],
    ...allOrdersData,
  ]);

  adjustCellsWidth(ws);
  if (courier) {
    XLSX.utils.book_append_sheet(wb, ws, `Dan-${currentDate} | Kurir-${courier}`, true);
  } else {
    XLSX.utils.book_append_sheet(wb, ws, `Dan-${currentDate}`, true);
  }
  const base64 = XLSX.write(wb, { type: 'base64' });

  if (courier) {
    return {
      fileName: `porudzbine-za-${courier}-${currentDate}.xlsx`,
      fileData: base64,
    };
  } else {
    return {
      fileName: `porudzbine-za-datum-${currentDate}.xlsx`,
      fileData: base64,
    };
  }
  // const filename = FileSystem.documentDirectory + `porudžbine-za-${currentDate}.xlsx`;
  // FileSystem.writeAsStringAsync(filename, base64, {
  //   encoding: FileSystem.EncodingType.Base64
  // }).then(() => {
  //   Sharing.shareAsync(filename);
  // });
};

/**
 * Sorts an array of orders based on createdAt field, oldest order is at the starting position
 * of the array and the latest is at the end
 * @param orders - OrderTypes[]
 * @returns - OrderTypes[]
 */
function sortOrdersByDate(orders: OrderTypes[]): OrderTypes[] {
  return orders.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
}
