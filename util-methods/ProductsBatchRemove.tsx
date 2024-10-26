import { popupMessage } from "../util-components/PopupMessage";


export async function handleRemoveBatch(selectedItems, token){
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/products/delete-item-batch`, {
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