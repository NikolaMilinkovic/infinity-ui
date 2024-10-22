import { popupMessage } from "../util-components/PopupMessage";
import { betterConsoleLog, betterErrorLog } from "./LogMethods";

export async function fetchData(token:string, api:string) {
  try{
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
    console.log('> calling handle fetching with form data method')
    const response = await handleFetchingWithFormData(formData, authToken, uri, 'POST');
    
    console.log('> handle fetching with form data finished')
    if (!response) {
      console.log('> !response')
      popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
      return false;
    }
    console.log('> returning response..')
    return response;
    
  } catch (error) {
    betterErrorLog('Error adding new order', error);
    popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
    return false;
  }
}

// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithFormData(formData: any, authToken: string, uri: string, method: string) {
  try {
    console.log('> handle fetching with form data started, here is backed uri> ', process.env.EXPO_PUBLIC_BACKEND_URI)
    console.log('> Uri is: ',uri);
    console.log('> Method is: ',method);
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/${uri}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
    });

    console.log('> Fetching completed, continuing.')

    if (!response.ok) {
      console.log('> !response, seems to be an error here')
      const parsedResponse = await response.json();
      console.log(parsedResponse.message);
      popupMessage(parsedResponse.message, 'danger');
      return false;
    }

    // Return the actual response data if the fetch is successful
    console.log('> Fetching finished successfully, returning response.json()');
    return await response.json(); // Parse and return the response body as JSON

  } catch (error) {
    betterErrorLog('Error adding new order', error);
    return false;
  }
}