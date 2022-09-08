import * as React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  disabled?: boolean;
  textValue: string;
  isPrimary?: boolean;
}

const Button = ({
  textValue,
  disabled,
  isPrimary = true,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: disabled ? "#ccc" : isPrimary ? "#6750A4" : "#FFF",
        borderColor: "#6750A4",
        borderWidth: isPrimary ? 0 : 1,
        marginTop: 24,
      }}
      disabled={!!disabled}
      {...rest}
    >
      <Text
        style={{ ...styles.buttonText, color: isPrimary ? "#FFF" : "#6750A4" }}
      >
        {textValue}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});
