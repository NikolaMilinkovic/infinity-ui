import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '../../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
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
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
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
        background={colors.background}
        labelBorders={false}
        activeColor={colors.highlight}
        containerStyles={[{ flex: 1.8 }]}
      />
      <DropdownList
        data={roleDropdownFilter}
        isDefaultValueOn={true}
        defaultValue={selectedRole}
        onSelect={(text) => setSelectedRole(text.value)}
        buttonContainerStyles={[{ flex: 1, height: 44 }, globalStyles.border]}
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

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
      gap: 8,
      elevation: 2,
      marginBottom: 4,
      flexDirection: 'row',
      paddingVertical: 22,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
    },
    picker: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 6,
    },
  });
}

export default UserFilter;
