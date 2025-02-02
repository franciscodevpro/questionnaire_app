import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MainContext from "../contexts/MainContext";
import Button from "./Button";

interface MainMenuProps {
  isActive: boolean;
  onClosePress: () => void;
  onChangeApplier: () => void;
  onListQuestionnaires: () => void;
  applier: string;
}

const MainMenu = (props: MainMenuProps) => {
  const fadeAnim = useRef(new Animated.Value(-300)).current;
  const { allUnsaved, updateAnswers, syncData } = useContext(MainContext);
  const [isClosingMenu, setIsClosingMenu] = useState(false);
  useEffect(() => {
    if (props.isActive) return fadeIn();
    fadeOut();
  }, [props.isActive]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    setIsClosingMenu(true);
    Animated.timing(fadeAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsClosingMenu(false));
  };

  return (
    <>
      <View
        style={{
          ...styles.mainMenuBackground,
          ...(!props.isActive && !isClosingMenu && { display: "none" }),
        }}
      />
      <Animated.View
        style={{
          ...styles.mainMenu,
          left: fadeAnim,
        }}
      >
        <View style={styles.mainMenuHeader}>
          <View style={styles.mainMenuHeaderContent}>
            <Icon name="user" size={30} color="#999" />
            <Text style={styles.mainMenuHeaderContentName}>
              {props.applier}
            </Text>
          </View>
          <TouchableOpacity onPress={() => props.onClosePress()}>
            <Icon
              name="plus"
              size={40}
              style={{
                transform: [{ rotate: "45deg" }],
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainMenuContent}>
          <Button
            textValue={`Sincronizar (${allUnsaved})`}
            disabled={!allUnsaved}
            onPress={async () => await syncData()}
          />
          <Button
            textValue="Listar questionários"
            isPrimary={false}
            onPress={() => props.onListQuestionnaires()}
          />
          <Button
            textValue="Trocar de entrevistador"
            isPrimary={false}
            onPress={() => props.onChangeApplier()}
          />
        </View>
      </Animated.View>
    </>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  mainMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "#fff",
    maxWidth: 300,
    width: "100%",
    overflow: "hidden",
  },
  mainMenuBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#000",
    width: "100%",
    opacity: 0.7,
  },
  mainMenuHeader: {
    flexDirection: "row",
    marginBottom: 24,
  },
  mainMenuHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  mainMenuHeaderContentName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#999",
  },
  mainMenuContent: {},
});
