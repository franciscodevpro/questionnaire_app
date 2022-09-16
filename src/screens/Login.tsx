import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Input from "../components/InputLabel";
import { SelectInput } from "../components/Select-input";
import { getAppliers } from "../repositories/appliers";
import { validadePin } from "../repositories/pins";

type LoginProps = {
  onLogin: (authData: {
    pin: string;
    applier: { id: string; name: string };
  }) => void;
};

export const Login = (props: LoginProps) => {
  const [disabled, setDisabled] = useState(true);
  const [pin, setPin] = useState<string | null>(null);
  const [applier, setApplier] = useState<{ name: string; id: string }>(null);
  const [data, setData] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    fetchAppliers();
  }, []);

  const fetchAppliers = async () => {
    const resultData = await getAppliers();
    setData(resultData.map((e) => ({ key: e.name, value: e.id })));
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    if (!!value && !!applier) return setDisabled(false);
    setDisabled(true);
  };

  const handleApplierChange = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    setApplier({ name: key, id: value });
    if (!!value && !!pin) return setDisabled(false);
    setDisabled(true);
  };

  const handleLogin = async () => {
    const isValid = await validadePin(pin);
    if (isValid) return props.onLogin({ pin, applier });

    Alert.alert("Pin informado não é válido!");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo02.png")} />
      <View style={styles.content}>
        <Input labelText="Pin" onChangeText={handlePinChange} />
        <Input
          labelText="Entrevistador"
          onChangeText={() => {}}
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
