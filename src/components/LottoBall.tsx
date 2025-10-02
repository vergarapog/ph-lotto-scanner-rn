import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LottoBallProps {
  number: number;
  isMatched?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LottoBall({
  number,
  isMatched = false,
  size = "md",
}: LottoBallProps) {
  const sizeStyles = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
  };

  const ballStyle = [
    styles.ball,
    sizeStyles[size],
    isMatched ? styles.matched : styles.default,
  ];

  return (
    <View style={ballStyle}>
      <Text style={[styles.text, sizeStyles[size]]}>{number}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  small: {
    width: 40,
    height: 40,
  },
  medium: {
    width: 56,
    height: 56,
  },
  large: {
    width: 80,
    height: 80,
  },
  default: {
    backgroundColor: "#3b82f6", // primary blue
  },
  matched: {
    backgroundColor: "#f59e0b", // accent orange
    borderWidth: 4,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
});
