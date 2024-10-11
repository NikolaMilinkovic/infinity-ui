import { useContext } from "react"
import { AuthContext } from "../../store/auth-context"
import { popupMessage } from "../../util-components/PopupMessage";

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