import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import { globalStyles } from '../../../constants/globalStyles';
import { DropdownTypes } from '../../../types/allTsTypes';
import DropdownList from '../../../util-components/DropdownList';
import InputField from '../../../util-components/InputField';

interface UserFilterProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

function UserFilter({ searchQuery, setSearchQuery, selectedRole, setSelectedRole }: UserFilterProps) {
  const [roleDropdownFilter, setRoleDropdownFilter] = useState<DropdownTypes[]>([
    { _id: 0, name: 'All', value: 'all' },
    { _id: 1, name: 'Admin', value: 'admin' },
    { _id: 2, name: 'User', value: 'user' },
  ]);

  return (
    <View style={styles.container}>
      {/* 🔎 Search Input */}
      <InputField
        label="Pretraži po username-u"
        inputText={searchQuery}
        setInputText={setSearchQuery}
        background={Colors.white}
        labelBorders={false}
        activeColor={Colors.highlight}
        containerStyles={{ flex: 1.8 }}
      />
      <DropdownList
        data={roleDropdownFilter}
        isDefaultValueOn={true}
        defaultValue={selectedRole}
        onSelect={(text) => setSelectedRole(text.value)}
        buttonContainerStyles={[{ flex: 1, height: 44 }, globalStyles.border, globalStyles.elevation_1]}
      />
      {/* <DropdownList2
        data={roleDropdownFilter}
        value={selectedRole || null}
        labelField="name"
        valueField="value"
        onChange={(item) => setSelectedRole(item.value)}
        containerStyle={{ flex: 1 }}
        resetValue={!selectedRole}
        placeholder="Izaberite ulogu"
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    gap: 8,
    elevation: 2,
    marginBottom: 4,
    flexDirection: 'row',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
});

export default UserFilter;
