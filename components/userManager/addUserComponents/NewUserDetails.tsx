import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimationWithContentVisibility } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { DropdownTypes } from '../../../types/allTsTypes';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';
import InputField from '../../../util-components/InputField';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  data: any;
  setData: any;
  dropdownRef?: any;
}
function NewUserDetails({ isExpanded, setIsExpanded, data, setData, dropdownRef }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const fadeAnimation = useToggleFadeAnimation(isExpanded, 180);

  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(true);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 250);
  const [userDropdownData, setUserDropdownData] = useState<DropdownTypes[]>([
    { _id: 0, name: 'Admin', value: 'admin' },
    { _id: 1, name: 'User', value: 'user' },
  ]);

  function handleToggleExpand() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  return (
    <View>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <CustomText variant="bold" style={styles.header}>
          Osnovne Informacije korisnika
        </CustomText>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={colors.whiteText}
        />
      </Pressable>

      {/* MAIN */}
      {isContentVisible && (
        <Animated.View style={{ height: toggleExpandAnimation, opacity: fadeAnimation, paddingTop: 6 }}>
          <View style={styles.contentContainer}>
            <InputField
              activeColor={colors.grayText}
              label="Korisničko ime (Username)"
              isSecure={false}
              inputText={data.username}
              setInputText={(text) => setData((prev: any) => ({ ...prev, username: text }))}
              background={colors.background}
              color={colors.defaultText}
              labelBorders={false}
            />
            <InputField
              activeColor={colors.grayText}
              label="Šifra (Password)"
              isSecure={false}
              inputText={data.password}
              setInputText={(text) => setData((prev: any) => ({ ...prev, password: text }))}
              background={colors.background}
              color={colors.defaultText}
              labelBorders={false}
              selectTextOnFocus={true}
            />
            <InputField
              activeColor={colors.grayText}
              label="Ime korisnika"
              isSecure={false}
              inputText={data.name}
              setInputText={(text) => setData((prev: any) => ({ ...prev, name: text }))}
              background={colors.background}
              color={colors.defaultText}
              labelBorders={false}
            />
            <DropdownList
              data={userDropdownData}
              isDefaultValueOn={true}
              defaultValue={data.role}
              onSelect={(text) => setData((prev: any) => ({ ...prev, role: text.value }))}
              reference={dropdownRef}
            />
            {/* <DropdownList2
              data={userDropdownData}
              value={data.role}
              labelField="name"
              valueField="value"
              onChange={(item) => setData((prev: any) => ({ ...prev, role: item.value }))}
              placeholder="Izaberite ulogu"
              containerStyle={{ marginTop: 4 }}
              resetValue={false}
            /> */}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      backgroundColor: colors.primaryDark,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 18,
      color: colors.whiteText,
    },
    listContainer: {
      padding: 10,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      marginBottom: 6,
    },
    contentContainer: {
      flexDirection: 'column',
      width: '100%',
      gap: 16,
      paddingHorizontal: 10,
    },
  });
}

export default NewUserDetails;
