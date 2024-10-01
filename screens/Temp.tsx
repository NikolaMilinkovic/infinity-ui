import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../util-components/Button'
import { AuthContext } from '../store/auth-context'
import { useContext } from 'react'
import { SocketContext } from '../store/socket-context';

function Temp() {
  const [counter, setCounter] = useState(0);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  useEffect(() => {

    async function getCounterData(){
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/testCounter`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if(response.status === 200){
        const data = await response.json();
        console.log(data);
        setCounter(data)
      } else {
        console.error('Error fetching counter data:', response.status, response.statusText);
      }
    }

    if(token) getCounterData();

    // Listen for counter updates from the server
    if(socket){
      socket.on('counterUpdated', (newCounter: number) => {
        console.log('Counter updated from socket:', newCounter)
        setCounter(newCounter);
      });
    }
    return () => {
      if (socket) {
        socket.off('counterUpdated');
      }
    };

  }, [token, socket])

  async function incrementCounter(){
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/testCounter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>This is the authenticated temp screen</Text>
      <Button
        onPress={authCtx.logout}
      />

      <Text>{counter}</Text>
      <Button
        onPress={incrementCounter}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})

export default Temp