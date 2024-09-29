import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
const BACKEND_URI = process.env.EXPO_PUBLIC_BACKEND_URI

interface LoginUserTypes{
  username: string
  password: string
}
interface LoginResponse{
  token: string
}
export async function loginUser({username, password}: LoginUserTypes){
  console.log('> Backend URI is: ' + BACKEND_URI);
  console.log(`> Provided username is ${username}`)
  console.log(`> Provided password is ${password}`)

  try{
    const response = await fetch(`${BACKEND_URI}/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      })
    });

    if(!response.ok){
      throw new Error('> Oops, something went wrong while logging in..')
    }

    console.log(`> Logging response:`)
    console.log(response)
    const data: LoginResponse = await response.json();
    console.log(`> Data is: ${data}`)
    return 'aklsfnklanklan'
  } catch (error){
    console.log(`> Error logging in the user ${error}`)
    throw new Error(`[ERROR] Failed to login user: ${error}`)
  }
}