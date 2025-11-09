import { Pressable, StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import IconButton from '../../../util-components/IconButton';

interface UserItemPropTypes {
  user: any;
  removeUserHandler: (userId: string) => void;
  setEditedUser: any;
}

function UserItem({ user, removeUserHandler, setEditedUser }: UserItemPropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  function handleOnPress(user: any) {}
  function handleOnEditPress(user: any) {
    setEditedUser(user);
  }

  return (
    <Pressable onPress={() => handleOnPress(user)}>
      <View style={styles.container}>
        <CustomText style={{ flex: 1, color: colors.grayText }}>
          Username:{'\n'}
          <CustomText variant="bold" style={[{ color: colors.defaultText }]}>
            {user?.username}
          </CustomText>
        </CustomText>
        <CustomText style={{ flex: 1, color: colors.grayText }}>
          Role: {'\n'}
          <CustomText variant="bold" style={[{ color: colors.defaultText }]}>
            {user?.role}
          </CustomText>
        </CustomText>
        <View style={styles.buttonsContainer}>
          <IconButton
            size={26}
            color={colors.iconColor}
            onPress={() => removeUserHandler(user?._id)}
            key={`key-${user?._id}-remove-button`}
            icon="delete"
            style={styles.editButtonContainer}
            pressedStyles={styles.buttonContainerPressed}
            backColor={'transparent'}
            backColor1={'transparent'}
          />
          <IconButton
            size={26}
            color={colors.iconColor}
            onPress={() => handleOnEditPress(user)}
            key={`key-${user?._id}-edit-button`}
            icon="edit"
            style={styles.editButtonContainer}
            pressedStyles={styles.buttonContainerPressed}
            backColor={'transparent'}
            backColor1={'transparent'}
          />
        </View>
      </View>
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: colors.background,
      minHeight: 60,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 10,
      flexDirection: 'row',
      marginBottom: 2,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    editButtonContainer: {
      borderRadius: 100,
      overflow: 'hidden',
      backgroundColor: colors.background,
      padding: 10,
    },
    buttonContainerPressed: {
      opacity: 0.7,
      elevation: 1,
    },
    bold: {
      fontWeight: 'bold',
    },
  });
}

export default UserItem;
