import React, { useEffect, useState, useContext } from 'react'
import InputField from '../../util-components/InputField'
import { View, StyleSheet, Text, Image } from 'react-native'
import Button from '../../util-components/Button'
import { AuthContext } from '../../store/auth-context';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { loginUser } from '../../util-methods/auth/AuthMethods';

function Login() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if(username && password) setErrorMessage('');
  }, [username, password])

  function loginUserHandler(username: string, password: string){
    if(!username || !password) {
      setErrorMessage('Invalid input, please provide a valid username & password.');
      return;
    }
    console.log('> setting isAuthenticating to true');
    setIsAuthenticating(true);
    try{
      setTimeout(() => {
        async function temp(){
          console.log('> Artificial timeout');
          const token = await loginUser({username, password});
          authCtx.authenticate(token);
        }
        temp();
      }, 3000)
    } catch(err){
      console.log(`[ERROR] Issue while logging in user: ${err}`);
      throw new Error(`[ERROR] Issue logging in user: ${err}`);
    }
    
  }

  if(isAuthenticating){
    return <LoadingOverlay message="Logging in.."/>
  }

  return (
    <View style={styles.container}>
        <Image 
          source={require('../../assets/infinity.png')}
          style={styles.image}
        />
      <View style={styles.inputsContainer}>
        <InputField
          label='Username'
          inputText={username}
          setInputText={setUsername}
        />
        <InputField
          label='Password'
          isSecure={true}
          inputText={password}
          setInputText={setPassword}
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
      <Button onPress={() => loginUserHandler(username, password)}>Login</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 44,
  },
  inputsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 28,
  },
  errorMessage: {
    color: 'red'
  },
  image: {
    maxHeight: 140,
    aspectRatio: 16/9,
    resizeMode: 'contain',
    marginBottom: 24
  }
})

export default Login