import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useAuthToken from '../../hooks/useAuthToken';
import { Excel } from '../../types/allTsTypes';
import { popupMessage } from '../../util-components/PopupMessage';
import { fetchData } from '../../util-methods/FetchMethods';
import { useSocket } from '../socket-context';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface EndOfDayExcelContextType {
  excels: Excel[];
  setExcels: React.Dispatch<React.SetStateAction<Excel[]>>;
  removeExcel: any;
}

const EndOfDayExcelContext = createContext<EndOfDayExcelContextType | undefined>(undefined);

export const useEndOfDayExcelContext = () => {
  const context = useContext(EndOfDayExcelContext);
  if (!context) throw new Error('useEndOfDayExcelContext must be used within EndOfDayExcelProvider');
  return context;
};

export const EndOfDayExcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [excels, setExcels] = useState<Excel[]>([]);
  const socket = useSocket();
  const token = useAuthToken();

  async function fetchExcelData() {
    try {
      const response = await fetch(
        `${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/excel/courier-excel-presets/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch excel presets');
      }

      const data = await response.json();
      if (data.length > 0) {
        setExcels(data);
      }
    } catch (error) {
      console.error('Error fetching excel presets:', error);
    }
  }

  async function removeExcel(id: string) {
    try {
      const response = await fetchData(token, `excel/courier-excel-presets/${id}`, 'DELETE');
      if (response === false) popupMessage('Došlo je do problema prilikom brisanja Excel šablona', 'danger');

      popupMessage(response.message, 'success');
    } catch (error) {
      console.error('Error while removing excel preset:', error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchExcelData();
    } else {
      setExcels([]);
    }
  }, [token]);

  // SOCKETS
  useEffect(() => {
    if (socket && token) {
      const handleExcelPresetAdded = (newExcel: Excel) => {
        setExcels((prevExcels) => [...prevExcels, newExcel]);
      };
      const handleExcelPresetRemoved = (removedId: string) => {
        setExcels((prevPresets) => prevPresets.filter((excel) => excel._id !== removedId));
      };
      const handleExcelPresetUpdate = (updatedExcel: Excel) => {
        setExcels((prevExcels) => prevExcels.map((excel) => (excel._id === updatedExcel._id ? updatedExcel : excel)));
      };

      socket.on('addExcelPreset', handleExcelPresetAdded);
      socket.on('removeExcelPreset', handleExcelPresetRemoved);
      socket.on('updateExcelPreset', handleExcelPresetUpdate);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('addExcelPreset', handleExcelPresetAdded);
        socket.off('removeExcelPreset', handleExcelPresetRemoved);
        socket.off('updateExcelPreset', handleExcelPresetUpdate);
      };
    }
  }, [socket, token]);

  return (
    <EndOfDayExcelContext.Provider value={{ excels, setExcels, removeExcel }}>{children}</EndOfDayExcelContext.Provider>
  );
};
