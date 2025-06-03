import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { SupplierTypes } from '../types/allTsTypes';
import { popupMessage } from '../util-components/PopupMessage';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface SupplierContextType {
  suppliers: SupplierTypes[];
  setSuppliers: (suppliers: SupplierTypes[]) => void;
  fetchSuppliers: (token: string) => void;
}
export const SuppliersContext = createContext<SupplierContextType>({
  suppliers: [],
  setSuppliers: () => {},
  fetchSuppliers: () => [],
});
interface SuppliersContextProviderType {
  children: ReactNode;
}

function SuppliersContextProvider({ children }: SuppliersContextProviderType) {
  const [suppliers, setSuppliers] = useState<SupplierTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  async function fetchSuppliers(token: string) {
    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/suppliers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        popupMessage('Došlo je do problema prilikom preuzimanja dobavljača.', 'danger');
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      if (data.length > 0) {
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }

  useEffect(() => {
    if (token) fetchSuppliers(token);
  }, [token]);

  function handleSupplierAdded(supplier: SupplierTypes) {
    setSuppliers((prev) => [supplier, ...prev]);
  }
  function handleSupplierUpdated(supplier: SupplierTypes) {
    setSuppliers((prev) =>
      prev.map((supplierInstance) =>
        supplierInstance._id.toString() === supplier._id.toString()
          ? { ...supplierInstance, name: supplier.name }
          : supplierInstance
      )
    );
  }

  useEffect(() => {}, [suppliers]);

  // TO DO: Fix the filter issue, for some reason this always returns an empty array..
  function handleSupplierRemoved(supplier: string) {
    fetchSuppliers(token as string);

    // const filteredSuppliers = suppliers.filter((supplierInstance) =>
    //   supplierInstance._id.toString() !== supplier
    // );

    // betterConsoleLog('> filteredSuppliers:', filteredSuppliers);
    // setSuppliers(filteredSuppliers);
  }

  useEffect(() => {
    if (socket) {
      socket.on('supplierAdded', handleSupplierAdded);
      socket.on('supplierUpdated', handleSupplierUpdated);
      socket.on('supplierRemoved', handleSupplierRemoved);

      return () => {
        socket.off('supplierAdded', handleSupplierAdded);
        socket.off('supplierUpdated', handleSupplierUpdated);
        socket.off('supplierRemoved', handleSupplierRemoved);
      };
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      suppliers,
      fetchSuppliers: fetchSuppliers,
      setSuppliers: setSuppliers,
    }),
    [suppliers]
  );

  return <SuppliersContext.Provider value={value}>{children}</SuppliersContext.Provider>;
}

export default SuppliersContextProvider;
