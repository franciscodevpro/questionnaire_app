import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface HeaderProps {
  onPressMenu: () => void;
}

const Header = (props: HeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => props.onPressMenu()}>
        <Icon name="menu" size={40} style={styles.icon} />
      </TouchableOpacity>
      <Image source={require("../../assets/logo01.png")} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  icon: {},
  header: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#000",
    paddingBottom: 24,
  },
});
