import { KeyboardToolbar } from 'react-native-keyboard-controller';
import { useUser } from '../../store/user-context';

interface KeyboardToolbarComponentPropTypes {
  doneText?: string;
}
function KeyboardToolbarComponent({ doneText = 'Završi unos' }: KeyboardToolbarComponentPropTypes) {
  const { user } = useUser();

  return <>{user?.settings?.ui?.displayKeyboardToolbar && <KeyboardToolbar doneText={doneText} />}</>;
}

export default KeyboardToolbarComponent;
