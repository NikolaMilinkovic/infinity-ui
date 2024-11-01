import { popupMessage } from "../util-components/PopupMessage";
import { betterConsoleLog, betterErrorLog } from "./LogMethods";

export async function fetchData(token:string | null, api:string) {
  try{
    if (token === null) return popupMessage('Auth token nedostaje kako bi se izvršio fetch.', 'danger');
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/${api}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if(!response.ok){
      const parsedResponse = await response.json();
      popupMessage(parsedResponse?.message, 'danger');
      return false;
    }

    const data = await response.json();
    return data;
  } catch(error){
    console.error('There was an error while fetching data: ', error);
    popupMessage('Error while fetching data', 'danger');
  }
}

// Handles sending the POST request to add a new product | Generic method
async function handleAddingProductFetch(formData:any, authToken:string, productName:string, uri: string):Promise<boolean>{
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/products/${uri}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })

    if(!response.ok) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'danger');
      return false;
    }

    popupMessage(`Proizvod pod imenom ${productName} je uspešno dodat.`, 'success');
    if(response.status === 200) return true
    return false

  } catch (error) {
    console.error('Fetch error:', error);
    betterErrorLog('Error adding new product', error);
    popupMessage(`Network error: ${error.message}`, 'danger');
    return false;
  }
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addDress(dressData:any, authToken:string):Promise<boolean>{
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', dressData.productName);
  formData.append('category', dressData.selectedCategory.name);
  formData.append('stockType', dressData.stockType);
  formData.append('price', dressData.price);
  formData.append('colors', JSON.stringify(dressData.itemColors));

  // Attach image
  if (dressData.productImage) {
    formData.append('image', {
      uri: dressData.productImage.uri,
      type: dressData.productImage.mimeType || 'image/jpeg',
      name: dressData.productImage.fileName || 'product_image.jpg',
    });
  }

  const result = await handleAddingProductFetch(formData, authToken, dressData.productName, 'dress');
  return result;
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addPurse(purseData:any, authToken:string):Promise<boolean>{
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', purseData.productName);
  formData.append('category', purseData.selectedCategory.name);
  formData.append('stockType', purseData.stockType);
  formData.append('price', purseData.price);
  formData.append('colors', JSON.stringify(purseData.itemColors));

  // Attach image
  if (purseData.productImage) {
    formData.append('image', {
      uri: purseData.productImage.uri,
      type: purseData.productImage.mimeType || 'image/jpeg',
      name: purseData.productImage.fileName || 'product_image.jpg',
    });
  }
  const result = await handleAddingProductFetch(formData, authToken, purseData.productName, 'purse');
  return result;
}

// NEW ORDER ADD METHOD
export async function addNewOrder(formData: any, authToken: string, uri: string) {
  try {
    const response = await handleFetchingWithFormData(formData, authToken, uri, 'POST');
    
    if (!response) {
      popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
      return false;
    }
    return response;
    
  } catch (error) {
    popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
    console.error('Network error details:', {
      message: error.message,
      stack: error.stack,
      details: error.toString()
    });
    throw error;
  }
}

// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithFormData(formData: any, authToken: string, uri: string, method: string) {
  try {
    // const formData = new FormData();
    // formData.append("buyerData", JSON.stringify(data.buyerData));
    // formData.append("productData", JSON.stringify(data.productData));
    // formData.append("productsPrice", data.productsPrice.toString());
    // formData.append("totalPrice", data.totalPrice.toString());
    // formData.append("reservation", data.reservation.toString());
    // formData.append("packed", 'false');
    // formData.append("processed", 'false');
    // formData.append("courier", JSON.stringify(data.courier));
    // formData.append('profileImage', {
    //   uri: data.uri,
    //   type: data.type,
    //   name: data.name,
    // } as any);

    // betterConsoleLog('> Logging form data', formData);

    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/${uri}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Network error details:', {
      message: error.message,
      stack: error.stack,
      details: error.toString()
    });
    throw error;
  }
}
// 'Content-Type': 'multipart/form-data'


// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithBodyData(data: any, authToken: string, uri: string, method: string) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/${uri}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    console.log('> Returning response...')
    if(!response.ok) popupMessage('Fetching with body data failed', 'danger')
    return response;
  } catch (error) {
    betterErrorLog('Error adding new order', error);
  }
}

// CATEGORIES FETCH
export async function fetchCategories(token: string | null){
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
      return data;
    }
    return []
    
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

export async function fetchWithBodyData(token: string | null, data: any){

}