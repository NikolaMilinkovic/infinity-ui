import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import Category from "../models/Category";

interface CategoryType{
  _id: string
  name: string
}

interface CategoriesContextType{
  categories: CategoryType[]
  setCategories: (categories: CategoryType[]) => void
  getCategories: () => CategoryType[]
}
export const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  setCategories: () => {},
  getCategories: () => []
});

interface CategoriesContextProviderType {
  children: ReactNode
}
function CategoriesContextProvider({ children }: CategoriesContextProviderType){
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const setCategoriesHandler = (categories: CategoryType[]) => {
    setCategories(categories);
  }
  const getCategoriesHandler = () => {
    return categories;
  }
  async function fetchCategories(token:string){
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      if(data.length > 0){
        const categoriesArr: CategoryType[] = [];
        data.forEach((entry:CategoryType) => {
          const newCategory = new Category(
            entry._id,
            entry.name,
          )
          categoriesArr.push(newCategory);
        });
        setCategories(categoriesArr);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    if(token) fetchCategories(token);
  }, [token])

  // SOCKETS
  useEffect(() => {
    if(socket){
      const handleCategoryAdded = (newCategory: Category) => {
        const newCategoryObj = new Category(
          newCategory._id,
          newCategory.name,
        )
        setCategories(prevCategories => [...prevCategories, newCategoryObj]);
      };
      const handleCategoryRemoved = (categoryId: string) => {
        setCategories(prevCategories => prevCategories.filter((category) => category._id !== categoryId));
      }
      const handleCategoryUpdated = (updatedCategory: Category) => {
        const newCategoryObj = new Category(
          updatedCategory._id,
          updatedCategory.name,
        );
        setCategories(prevCategories => 
          prevCategories.map(category => 
            category._id === updatedCategory._id ? newCategoryObj : category
          )
        );
      }
  
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

export default CategoriesContextProvider