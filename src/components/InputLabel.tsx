import * as React from "react";
import { Text, StyleSheet, TextInput } from "react-native";

interface InputProps {
  onChangeText?: (value: string) => void;
  labelText?: string;
  inputElement?: React.ReactComponentElement<any>;
}

const Input = (props: InputProps) => {
  return (
    <>
      {props?.labelText && (
        <Text style={styles.labelInput}>{props.labelText}</Text>
      )}
      {props?.inputElement ? (
        props.inputElement
      ) : (
        <TextInput
          style={styles.textInput}
          onChangeText={(value) =>
            props?.onChangeText && props.onChangeText(value)
          }
        />
      )}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  textInput: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  labelInput: {
    fontSize: 16,
    fontWeight: "400",
    color: "#999",
    marginTop: 24,
    marginBottom: 5,
  },
});
