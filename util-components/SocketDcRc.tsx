import { useContext } from 'react';
import { SocketContext } from '../store/socket-context';
import { useThemeColors } from '../store/theme-context';
import Button from './Button';

function SocketDcRc() {
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;
  const colors = useThemeColors();
  function connect(socket: any): void {
    if (socket) socket.connect();
  }
  function disconnect(socket: any): void {
    if (socket) socket.disconnect();
  }

  return (
    <>
      <Button textColor={colors.defaultText} onPress={() => disconnect(socket)}>
        Disconnect
      </Button>
      <Button textColor={colors.defaultText} onPress={() => connect(socket)}>
        Reconnect
      </Button>
    </>
  );
}

export default SocketDcRc;
