import React, { createContext, ReactNode, useContext, useState } from 'react';
import uuid from 'react-native-uuid';
import useAuthToken from '../../hooks/useAuthToken';
import { DropdownTypes, Excel, ExcelColumn } from '../../types/allTsTypes';
import { popupMessage } from '../../util-components/PopupMessage';
import { fetchWithBodyData } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';
import { useEndOfDayExcelContext } from './end-of-day-excel-presets-context';

interface NewExcelContextType {
  excelData: Excel;
  setExcelData: React.Dispatch<React.SetStateAction<Excel>>;
  updateColumn: (columnId: string, updates: Partial<ExcelColumn>) => void;
  removeColumn: (columnId: string) => void;
  dropdownData: DropdownTypes[];
  error: string | null;
  setError: (error: string) => void;
  handleAddNewExcel: () => void;
}

const NewExcelContext = createContext<NewExcelContextType | undefined>(undefined);

export const useNewExcel = () => {
  const context = useContext(NewExcelContext);
  if (!context) throw new Error('useExcel must be used within NewExcelProvider');
  return context;
};

export const NewExcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const excelsCtx = useEndOfDayExcelContext();
  const token = useAuthToken();
  const [excelData, setExcelData] = useState<Excel>({
    boutiqueId: '',
    name: '',
    isDefault: false,
    columns: [
      {
        temp_id: uuid.v4(),
        name: '',
        source: { type: 'field', valueKey: '' },
        options: { defaultValue: '', isAllCaps: false, format: '' },
      },
    ],
  });

  const dropdownData = [
    { _id: 'buyer_name', name: 'Ime i prezime', value: '.buyer?.name' },
    { _id: 'buyer_address', name: 'Adresa', value: '.buyer?.address' },
    { _id: 'buyer_place', name: 'Mesto', value: '.buyer?.place' },
    { _id: 'buyer_phone', name: 'Telefon', value: '.buyer?.phone' },
    { _id: 'buyer_phone2', name: 'Telefon 2', value: '.buyer?.phone2' },
    { _id: 'total_price', name: 'Otkup', value: '.totalPrice' },
    { _id: 'internal_remark', name: 'Interna napomena', value: '.internalRemark' },
    { _id: 'delivery_remark', name: 'Napomena za dostavu', value: '.deliveryRemark' },
    { _id: 'courier_name', name: 'Kurir', value: '.courier?.name' },
    { _id: 'courier_delivery_price', name: 'Cena dostave', value: '.courier?.deliveryPrice' },
    { _id: 'reservation', name: 'Rezervacija', value: '.reservation' },
    { _id: 'reservation_date', name: 'Datum rezervacije', value: '.reservationDate' },
  ];

  const updateColumn = (columnId: string, updates: Partial<ExcelColumn>) => {
    setExcelData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.temp_id === columnId ? { ...col, ...updates } : col)),
    }));
  };

  const removeColumn = (columnId: string) => {
    setExcelData((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.temp_id !== columnId),
    }));
  };

  function validateData() {
    let errorMsg = null;
    const trimmedName = excelData.name?.trim();
    const nameExists = excelsCtx.excels.some((e) => e.name.trim().toLowerCase() === trimmedName.toLowerCase());

    if (!trimmedName) {
      errorMsg = 'Ime excel šablona je obavezno.';
      return { val: false, errorMsg };
    }

    if (nameExists) {
      errorMsg = 'Excel šablon sa tim imenom već postoji.';
      return { val: false, errorMsg };
    }

    if (excelData.columns.length === 0) {
      errorMsg = 'Excel šablon mora imati najmanje jednu kolonu.';
      return { val: false, errorMsg };
    }

    for (const col of excelData.columns) {
      if (!col.name || !col.name.trim()) {
        errorMsg = 'Sve kolone moraju imati ime.';
        return { val: false, errorMsg };
      }
    }

    setError(null);
    return { val: true, errorMsg: null };
  }

  async function handleAddNewExcel() {
    try {
      let isValid = validateData();
      if (isValid.val) {
        const response = await fetchWithBodyData(token, 'excel/courier-excel-presets/', excelData, 'POST');
        if (!response || !response?.ok) {
          popupMessage('Došlo je do problema prilikom dodavanja novog Excel šablona', 'danger');
        } else {
          popupMessage(`Excel šablon ${excelData.name} uspešno dodat`, 'success');
          resetNewExcelData();
        }
      } else {
        if (isValid.errorMsg) popupMessage(isValid.errorMsg, 'danger');
      }
    } catch (error) {
      betterErrorLog('> Error while adding a new excel preset', error);
    }
  }

  function resetNewExcelData() {
    setExcelData({
      boutiqueId: '',
      name: '',
      isDefault: false,
      columns: [
        {
          temp_id: uuid.v4(),
          name: '',
          source: { type: 'field', valueKey: '' },
          options: { defaultValue: '', isAllCaps: false, format: '' },
        },
      ],
    });
  }

  return (
    <NewExcelContext.Provider
      value={{ excelData, setExcelData, updateColumn, removeColumn, dropdownData, error, setError, handleAddNewExcel }}
    >
      {children}
    </NewExcelContext.Provider>
  );
};
