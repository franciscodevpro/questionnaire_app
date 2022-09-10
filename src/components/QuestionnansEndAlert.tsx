import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Button from "./Button";

interface QuestionnansEndAlertProps {
  isActive: boolean;
  onOk: () => void;
}

const QuestionnansEndAlert = (props: QuestionnansEndAlertProps) => {
  return (
    <>
      <View
        style={{
          ...styles.AlertAbsoluteContent,
          opacity: 0.7,
          backgroundColor: "#000",
          ...(!props.isActive && { display: "none" }),
        }}
      ></View>
      <View
        style={{
          ...styles.AlertAbsoluteContent,
          ...(!props.isActive && { display: "none" }),
        }}
      >
        <View style={styles.AlertBox}>
          <Icon name="check-square" size={30} color="#999" />
          <Text style={styles.AlertBoxTitle}>Questionário finalizado</Text>
          <Text style={styles.AlertBoxSubtitle}>
            O questionário Eleições para senador foi respondido com sucesso!
          </Text>
          <Button textValue="Entendido" onPress={() => props.onOk()} />
        </View>
      </View>
    </>
  );
};

export default QuestionnansEndAlert;

const styles = StyleSheet.create({
  AlertAbsoluteContent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 24,
  },
  AlertBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 15,
  },
  AlertBoxTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 16,
    color: "#999",
  },
  AlertBoxSubtitle: {},
});
