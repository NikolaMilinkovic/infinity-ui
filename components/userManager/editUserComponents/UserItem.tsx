import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import IconButton from '../../../util-components/IconButton';

interface UserItemPropTypes {
  user: any;
  removeUserHandler: (userId: string) => void;
  setEditedUser: any;
}

function UserItem({ user, removeUserHandler, setEditedUser }: UserItemPropTypes) {
  function handleOnPress(user: any) {}
  function handleOnEditPress(user: any) {
    setEditedUser(user);
  }

  return (
    <Pressable onPress={() => handleOnPress(user)}>
      <View style={styles.container}>
        <Text style={{ flex: 1, color: Colors.secondaryLightDarken }}>
          Username: <Text style={[styles.bold, { color: Colors.primaryDark }]}>{user.username}</Text>
        </Text>
        <Text style={{ flex: 1, color: Colors.secondaryLightDarken }}>Role: {user.role}</Text>
        <View style={styles.buttonsContainer}>
          <IconButton
            size={26}
            color={Colors.secondaryDark}
            onPress={() => removeUserHandler(user._id)}
            key={`key-${user._id}-remove-button`}
            icon="delete"
            style={styles.editButtonContainer}
            pressedStyles={styles.buttonContainerPressed}
          />
          <IconButton
            size={26}
            color={Colors.secondaryDark}
            onPress={() => handleOnEditPress(user)}
            key={`key-${user._id}-edit-button`}
            icon="edit"
            style={styles.editButtonContainer}
            pressedStyles={styles.buttonContainerPressed}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2,
  },
  buttonContainerPressed: {
    opacity: 0.7,
    elevation: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default UserItem;
