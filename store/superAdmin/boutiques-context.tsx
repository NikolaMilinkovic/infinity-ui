import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useAuthToken from '../../hooks/useAuthToken';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import { useUser } from '../user-context';
const backendURI = Constants.expoConfig?.extra?.backendURI;

export interface BoutiqueTypes {
  _id: string;
  boutiqueName: string;
  isActive: boolean;
}

interface BoutiquesContextType {
  boutiques: BoutiqueTypes[];
  setBoutiques: (boutiques: BoutiqueTypes[]) => void;
  editedBoutique: BoutiqueTypes | null;
  setEditedBoutique: (boutique: BoutiqueTypes | null) => void;
}

const BoutiquesContext = createContext<BoutiquesContextType | undefined>(undefined);

export const useBoutiques = () => {
  const context = useContext(BoutiquesContext);
  if (!context) throw new Error('useBoutiquesContext must be used within BoutiquesProvider');
  return context;
};

export const BoutiquesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boutiques, setBoutiques] = useState<BoutiqueTypes[]>([]);
  const [editedBoutique, setEditedBoutique] = useState<BoutiqueTypes | null>(null);
  useEffect(() => {
    betterConsoleLog('> editedBoutique', editedBoutique);
  }, [editedBoutique]);
  const { user } = useUser();
  const token = useAuthToken();

  async function fetchBoutiquesData() {
    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/admin/get-boutiques/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch boutiques data');
      }

      const data = await response.json();
      if (data.boutiques && data.boutiques.length > 0) {
        setBoutiques(data.boutiques);
      }
    } catch (error) {
      console.error('Error fetching boutiques data:', error);
    }
  }

  // async function removeExcel(id: string) {
  //   try {
  //     const response = await fetchData(token, `excel/courier-excel-presets/${id}`, 'DELETE');
  //     if (response === false) popupMessage('Došlo je do problema prilikom brisanja Excel šablona', 'danger');

  //     popupMessage(response.message, 'success');
  //   } catch (error) {
  //     console.error('Error while removing excel preset:', error);
  //   }
  // }

  useEffect(() => {
    if (token && user?.isSuperAdmin) {
      fetchBoutiquesData();
    } else {
      setBoutiques([]);
    }
  }, [token]);

  return (
    <BoutiquesContext.Provider value={{ boutiques, setBoutiques, editedBoutique, setEditedBoutique }}>
      {children}
    </BoutiquesContext.Provider>
  );
};
