import * as React from "react";
import { StyleSheet } from "react-native";
import SelectList, { SelectListProps } from "react-native-dropdown-select-list";

interface SelectInputProps extends SelectListProps {
  onSelect: (value: string) => void;
}

export const SelectInput = (props: SelectInputProps) => {
  const [selected, setSelected] = React.useState("");

  return (
    <>
      <SelectList
        setSelected={setSelected}
        placeholder="-"
        {...props}
        onSelect={() => props.onSelect && props.onSelect(selected)}
        style={styles.dropdown}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
});
