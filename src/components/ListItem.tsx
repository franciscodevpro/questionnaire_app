import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface ListItemProps {
  title: string;
  subTitle?: string;
  onPress: () => void;
}

const ListItem = (props: ListItemProps) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemInfo}>
        <Text style={styles.listItemInfoTitle}>{props.title}</Text>
        <Text>{props.subTitle && props.subTitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.listItemButton}
        onPress={() => props.onPress()}
      >
        <Icon name="chevron-right" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 24,
    overflow: "hidden",
  },
  listItemInfo: {
    flex: 1,
    padding: 24,
  },
  listItemInfoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  listItemButton: {
    width: 80,
    backgroundColor: "#6750A4",
    padding: 24,
  },
});
