import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Input from "../components/InputLabel";
import { SelectInput } from "../components/Select-input";

type LoginProps = {
  onLogin: (authData: { pin: string; applier: string }) => void;
};

export const Login = (props: LoginProps) => {
  const [disabled, setDisabled] = useState(true);
  const [pin, setPin] = useState<string | null>(null);
  const [applier, setApplier] = useState<string | null>(null);

  const handlePinChange = (value: string) => {
    setPin(value);
    if (!!value && !!applier) return setDisabled(false);
    setDisabled(true);
  };

  const handleApplierChange = (value: string) => {
    setApplier(value);
    if (!!value && !!pin) return setDisabled(false);
    setDisabled(true);
  };

  const handleLogin = () => {
    props.onLogin({ pin, applier });
  };

  const data = [
    { value: "Carlos", key: "Carlos" },
    { value: "Daniel", key: "Daniel" },
    { value: "Adriana", key: "Adriana" },
  ];

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo02.png")} />
      <View style={styles.content}>
        <Input labelText="Pin" onChangeText={handlePinChange} />
        <Input
          labelText="Entrevistador"
          onChangeText={handleApplierChange}
          inputElement={
            <SelectInput onSelect={handleApplierChange} data={data} />
          }
        />
      </View>
      <Button
        textValue="Entrar"
        disabled={disabled}
        onPress={() => handleLogin()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
