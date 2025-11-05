import { StatusBar } from 'expo-status-bar';
import { useContext, useMemo, useState } from 'react';
import { FlatList, Modal, Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import useConfirmationModal from '../../hooks/useConfirmationMondal';
import { useFadeTransition } from '../../hooks/useFadeTransition';
import { AppContext } from '../../store/app-context';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import ConfirmationModal from '../../util-components/ConfirmationModal';
import CustomText from '../../util-components/CustomText';
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
  const appCtx = useContext(AppContext);
  useBackClickHandler(!!editedUser, handleRemoveEditedUser);
  function handleRemoveEditedUser() {
    setEditedUser(null);
  }
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const filteredUsers = useMemo(() => {
    return user.usersList.filter((u) => {
      const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;

      // Filter out root user, aka me :)
      const notBoutiqueAccount = u.username !== appCtx.data.boutiqueName.toLowerCase();
      return matchesSearch && matchesRole && notBoutiqueAccount;
    });
  }, [user.usersList, searchQuery, selectedRole, appCtx.data.boutiqueName]);

  function getTotalUsersCount() {
    return (
      <CustomText variant="bold" style={styles.listHeader}>
        Ukupno korisnika: {filteredUsers.length}
      </CustomText>
    );
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
      <View style={styles.container}>
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

      <Modal
        animationType="fade"
        visible={editedUser !== null}
        onRequestClose={handleRemoveEditedUser}
        presentationStyle={Platform.OS === 'android' ? 'overFullScreen' : 'pageSheet'}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryDark }}>
          <StatusBar style="light" translucent />
          <Animated.ScrollView contentContainerStyle={editProductFade}>
            {editedUser && <EditUserModal user={editedUser} setUser={setEditedUser} />}
          </Animated.ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background2,
    },
    list: {},
    listHeader: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 6,
      color: colors.defaultText,
    },
    listContainer: {
      paddingBottom: 150,
    },
  });
}

export default EditUser;
