import React, { useContext } from 'react'
import { SocketContext } from '../store/socket-context'
import Button from './Button';

function SocketDcRc() {
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  function connect(socket:any): void{
    if(socket)
      socket.connect();
  }
  function disconnect(socket:any): void{
    if(socket) 
      socket.disconnect();
  }

  return (
    <>
      <Button
        onPress={() => disconnect(socket)}
      >
        Disconnect
      </Button>
      <Button
        onPress={() => connect(socket)}
      >
        Reconnect
      </Button>
    </>
  )
}

export default SocketDcRc