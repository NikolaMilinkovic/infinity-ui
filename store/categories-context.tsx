import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Category from '../models/Category';
import { CategoryTypes } from '../types/allTsTypes';
import { fetchCategories } from '../util-methods/FetchMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';

interface CategoriesContextType {
  categories: CategoryTypes[];
  setCategories: (categories: CategoryTypes[]) => void;
  getCategories: () => CategoryTypes[];
}
export const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  setCategories: () => {},
  getCategories: () => [],
});

interface CategoriesContextProviderType {
  children: ReactNode;
}
function CategoriesContextProvider({ children }: CategoriesContextProviderType) {
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const setCategoriesHandler = (categories: CategoryTypes[]) => {
    setCategories(categories);
  };
  const getCategoriesHandler = () => {
    return categories;
  };

  // Fetches initial categories data
  useEffect(() => {
    async function fetchCategoriesData() {
      if (token) {
        setCategories(await fetchCategories(token));
      } else {
        setCategories([]);
      }
    }
    fetchCategoriesData();
  }, [token]);

  // SOCKETS
  useEffect(() => {
    if (socket) {
      const handleCategoryAdded = (newCategory: Category) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
      };
      const handleCategoryRemoved = (categoryId: string) => {
        setCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryId));
      };
      const handleCategoryUpdated = (updatedCategory: Category) => {
        setCategories((prevCategories) =>
          prevCategories.map((category) => (category._id === updatedCategory._id ? updatedCategory : category))
        );
      };

      socket.on('categoryAdded', handleCategoryAdded);
      socket.on('categoryRemoved', handleCategoryRemoved);
      socket.on('categoryUpdated', handleCategoryUpdated);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('categoryAdded', handleCategoryAdded);
        socket.off('categoryRemoved', handleCategoryRemoved);
        socket.off('categoryUpdated', handleCategoryUpdated);
      };
    }
  }, [socket]);

  const value = { categories, setCategories: setCategoriesHandler, getCategories: getCategoriesHandler };
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export default CategoriesContextProvider;
