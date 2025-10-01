import React, { useContext, useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import { useFadeTransition, useFadeTransitionReversed } from '../../hooks/useFadeTransition';
import { AuthContext } from '../../store/auth-context';
import { useUser } from '../../store/user-context';
import ConfirmationModal from '../../util-components/ConfirmationModal';
import { popupMessage } from '../../util-components/PopupMessage';
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods';
import EditUserModal from './editUserComponents/EditUserModal';
import UserFilter from './editUserComponents/UserFilter';
import UserItem from './editUserComponents/UserItem';

function EditUser() {
  const user = useUser();
  const authCtx = useContext(AuthContext);
  const token = authCtx.token || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editedUser, setEditedUser] = useState(null);
  const editProductFade = useFadeTransition(editedUser !== null);
  const overlayView = useFadeTransitionReversed(editedUser === null, 500, 150);
  useBackClickHandler(!!editedUser, handleRemoveEditedUser);
  function handleRemoveEditedUser() {
    setEditedUser(null);
  }

  const filteredUsers = useMemo(() => {
    return user.usersList.filter((u) => {
      const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [user.usersList, searchQuery, selectedRole]);

  function getTotalUsersCount() {
    return <Text style={styles.listHeader}>Ukupno korisnika: {filteredUsers.length}</Text>;
  }

  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  async function removeUserHandler(userId: string) {
    showModal(async () => {
      if (!token) return;
      const response = await handleFetchingWithBodyData({ userId }, token, 'user/remove-user', 'DELETE');

      if (response && !response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      if (!response) {
        return popupMessage('Došlo je do problema prilikom brisanja korisnika.', 'danger');
      }

      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'success');
    });
  }

  return (
    <>
      <View style={{ minHeight: '100%' }}>
        <Animated.View style={[overlayView, styles.overlayView]} />
        <ConfirmationModal
          isVisible={isModalVisible}
          onConfirm={confirmAction}
          onCancel={hideModal}
          message="Da li sigurno želiš da obrišeš ovog korisnika?"
        />

        <UserFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <UserItem user={item} removeUserHandler={removeUserHandler} setEditedUser={setEditedUser} />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={() => getTotalUsersCount()}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={20}
          removeClippedSubviews={true}
        />
      </View>
      <Modal animationType="slide" visible={editedUser !== null} onRequestClose={handleRemoveEditedUser}>
        <Animated.View style={editProductFade}>
          <EditUserModal user={editedUser} setUser={setEditedUser} />
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: {},
  listHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  listContainer: {
    paddingBottom: 150,
  },
  overlayView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'white',
    pointerEvents: 'none',
  },
});

export default EditUser;
