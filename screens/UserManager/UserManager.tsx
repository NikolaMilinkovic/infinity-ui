import React from 'react';
import SafeView from '../../components/layout/SafeView';
import AddUser from '../../components/userManager/AddUser';

function UserManager() {
  return (
    <SafeView>
      <AddUser />
    </SafeView>
  );
}

export default UserManager;
