import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface SelectInputProps {
  onSelect: (value: string) => void;
  data: { value: string; key: string }[];
}

export const SelectInput = (props: SelectInputProps) => {
  const [selected, setSelected] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    props.onSelect(value);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.dropdown}>
          <Icon
            name="user"
            size={24}
            style={{
              textAlignVertical: "center",
              color: "#ccc",
              paddingRight: 16,
            }}
          />
          <Text style={{ flex: 1 }}>{selected || "-"}</Text>
          <Icon
            name={isOpen ? "chevron-down" : "chevron-right"}
            style={{ textAlignVertical: "center" }}
          />
        </View>
      </TouchableWithoutFeedback>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          <ScrollView>
            {props.data.map((elm, key) => (
              <TouchableOpacity
                key={key}
                style={styles.dropdownOptionsItem}
                onPress={() => handleSelect(elm.value)}
              >
                <Text>{elm.key}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "relative",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    overflow: "visible",
  },
  dropdownOptions: {
    position: "relative",
    left: 0,
    right: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    maxHeight: 144,
  },
  dropdownOptionsItem: {
    padding: 16,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
});
