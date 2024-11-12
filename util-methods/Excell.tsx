import { OrderTypes } from "../types/allTsTypes";
import { getCurrentDate } from "./DateFormatters";
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
 * 
 * @param orders - OrderTypes[] - Array of orders
 * @returns - Object that contains
 * {
 *   "filename": string,
 *   "fileData": base64
 * }
 */
export const generateExcellForOrders = (orders: OrderTypes[]) => {
  let allOrdersData = [];
  let index = 1;
  for(const order of orders){
    const orderData = [];
    orderData.push(order.buyer?.name || '');            // Ime i prezime
    orderData.push(order.buyer?.address || '');         // Adresa
    orderData.push(order.buyer?.place || '');           // Mesto
    orderData.push(order.buyer?.phone || '');           // Telefon
    orderData.push(order.buyer?.phone2 || '');          // Telefon 2
    orderData.push(order?.weight || '0.5');             // Tezina
    orderData.push(index);                              // Br paketa
    orderData.push(order?.value || '');                 // Vrednost
    orderData.push(order?.totalPrice || '');             // Otkup
    orderData.push(order?.buyer.bankNumber || '');      // Ziro rcun
    orderData.push(order.courier?.deliveryPrice || ''); // Postarina
    orderData.push(order?.internalRemark || '');        // Inerna napomena
    orderData.push(order?.deliveryRemark || '');        // Napomena za dostavu
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
      'telefon', 
      'telefon 2', 
      'težina', 
      'broj paketa', 
      'vrednost', 
      'otkup', 
      'žiro/račun', 
      'poštarina', 
      'interna napomena', 
      'napomena za dostavu'
    ],
    ...allOrdersData,
  ]);

  adjustCellsWidth(ws);
  XLSX.utils.book_append_sheet(wb, ws, `Dan-${currentDate}`, true);
  const base64 = XLSX.write(wb, { type: 'base64' });
  // return {
  //   "filename": `porudžbine-za-${currentDate}.xlsx`,
  //   "fileData": base64
  // }
  const filename = FileSystem.documentDirectory + `porudžbine-za-${currentDate}.xlsx`;
  FileSystem.writeAsStringAsync(filename, base64, {
    encoding: FileSystem.EncodingType.Base64
  }).then(() => {
    Sharing.shareAsync(filename);
  });
}