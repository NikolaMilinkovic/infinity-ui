import { Text } from 'react-native';

interface TruncatedTextStyles {
  children: string;
  numberOfLines?: number;
  style?: any;
}

const TruncatedText = ({ children, numberOfLines = 1, style }: TruncatedTextStyles) => {
  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={style}>
      {children}
    </Text>
  );
};

export default TruncatedText;
