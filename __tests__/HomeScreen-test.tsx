import { render } from '@testing-library/react-native';

import App from '../App';

describe('<App />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = render(<App />);

    getByText('Open up App.tsx to start working on your app!');
  });
});
