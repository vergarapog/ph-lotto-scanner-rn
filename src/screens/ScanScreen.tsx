import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import {
  LOTTO_GAMES,
  mockOCR,
  MOCK_WINNING_DRAWS,
  compareNumbers,
  getPrizeInfo,
} from "../data/lotto-data";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScanScreen() {
  const navigation = useNavigation();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (method: "camera" | "upload") => {
    if (!selectedGame) {
      Alert.alert("Error", "Please select a lotto game first");
      return;
    }

    setIsScanning(true);

    try {
      let result;
      if (method === "camera") {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert(
            "Permission Required",
            "Camera permission is required to scan tickets"
          );
          setIsScanning(false);
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert(
            "Permission Required",
            "Gallery permission is required to select images"
          );
          setIsScanning(false);
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        // Simulate OCR processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock OCR result
        const scannedNumbers = mockOCR(selectedGame);
        const winningDraw = MOCK_WINNING_DRAWS.find(
          (d) => d.gameId === selectedGame
        );

        if (winningDraw) {
          const matchCount = compareNumbers(
            scannedNumbers,
            winningDraw.numbers
          );
          const { prize, isWinner } = getPrizeInfo(matchCount);

          const scanResult = {
            id: Date.now().toString(),
            gameId: selectedGame,
            scannedNumbers,
            winningNumbers: winningDraw.numbers,
            matchCount,
            prize,
            isWinner,
            date: new Date().toISOString(),
          };

          // Store in AsyncStorage
          try {
            const existingHistory = await AsyncStorage.getItem("scanHistory");
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.unshift(scanResult);
            // Keep only last 20 scans
            const limitedHistory = history.slice(0, 20);
            await AsyncStorage.setItem(
              "scanHistory",
              JSON.stringify(limitedHistory)
            );
          } catch (error) {
            console.error("Error saving scan result:", error);
          }

          navigation.navigate(
            "Result" as never,
            { result: scanResult } as never
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process the image. Please try again.");
    }

    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan Lotto Ticket</Text>
          <Text style={styles.headerSubtitle}>
            Select game and scan your ticket
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Game Selection */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Lotto Game</Text>
            <Text style={styles.cardDescription}>
              Choose which game you want to check
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGame}
                onValueChange={setSelectedGame}
                style={styles.picker}
              >
                <Picker.Item label="Select a game" value="" />
                {LOTTO_GAMES.map((game) => (
                  <Picker.Item
                    key={game.id}
                    label={`${game.name} (1-${game.range})`}
                    value={game.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Scan Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan Method</Text>

            <TouchableOpacity
              style={[
                styles.scanOption,
                isScanning && styles.scanOptionDisabled,
              ]}
              onPress={() => !isScanning && handleScan("camera")}
              disabled={isScanning}
            >
              <View style={styles.scanOptionIcon}>
                <Ionicons name="camera" size={32} color="#3b82f6" />
              </View>
              <View style={styles.scanOptionText}>
                <Text style={styles.scanOptionTitle}>Take Photo</Text>
                <Text style={styles.scanOptionSubtitle}>
                  Use your camera to scan
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.scanOption,
                isScanning && styles.scanOptionDisabled,
              ]}
              onPress={() => !isScanning && handleScan("upload")}
              disabled={isScanning}
            >
              <View
                style={[
                  styles.scanOptionIcon,
                  { backgroundColor: "rgba(245, 158, 11, 0.1)" },
                ]}
              >
                <Ionicons name="image" size={32} color="#f59e0b" />
              </View>
              <View style={styles.scanOptionText}>
                <Text style={styles.scanOptionTitle}>Upload Image</Text>
                <Text style={styles.scanOptionSubtitle}>
                  Choose from gallery
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Scanning State */}
          {isScanning && (
            <View style={styles.scanningCard}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.scanningTitle}>Scanning Ticket...</Text>
              <Text style={styles.scanningSubtitle}>
                Extracting numbers from your ticket
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Tips for Best Results</Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instructionItem}>
                • Ensure good lighting when taking photos
              </Text>
              <Text style={styles.instructionItem}>
                • Keep the ticket flat and in focus
              </Text>
              <Text style={styles.instructionItem}>
                • Make sure all numbers are visible
              </Text>
              <Text style={styles.instructionItem}>
                • Avoid shadows and glare
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  scanOption: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scanOptionDisabled: {
    opacity: 0.5,
  },
  scanOptionIcon: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 50,
    padding: 16,
  },
  scanOptionText: {
    flex: 1,
  },
  scanOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  scanOptionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  scanningCard: {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  scanningTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  scanningSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: "#6b7280",
  },
});
