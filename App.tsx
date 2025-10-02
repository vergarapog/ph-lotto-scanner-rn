import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import ResultScreen from "./src/screens/ResultScreen";
import HistoryScreen from "./src/screens/HistoryScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ScanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScanMain"
        component={ScanScreen}
        options={{
          title: "Scan Ticket",
          headerStyle: { backgroundColor: "#3b82f6" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: "Scan Result",
          headerStyle: { backgroundColor: "#3b82f6" },
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Scan") {
            iconName = focused ? "scan" : "scan-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#3b82f6" },
          headerTintColor: "white",
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{
          title: "Scan",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          headerStyle: { backgroundColor: "#3b82f6" },
          headerTintColor: "white",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <MainTabs />
    </NavigationContainer>
  );
}
