import { popupMessage } from "../util-components/PopupMessage";
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;


export async function handleRemoveBatch(selectedItems, token){
  try{
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/products/delete-item-batch`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedItems),
    })

    return response;
  } catch(error){
    console.error('Error deleting category:', error);
  }
}