import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { LottoBall } from "../components/LottoBall";
import { MOCK_WINNING_DRAWS, LOTTO_GAMES } from "../data/lotto-data";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="trophy" size={40} color="white" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Lotto Scanner</Text>
              <Text style={styles.headerSubtitle}>
                Check your winning numbers
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Scan Button */}
          <View style={styles.scanCard}>
            <View style={styles.scanIconContainer}>
              <Ionicons name="scan" size={64} color="#3b82f6" />
            </View>
            <Text style={styles.scanTitle}>Scan Your Ticket</Text>
            <Text style={styles.scanSubtitle}>
              Upload or take a photo of your lotto ticket
            </Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate("Scan" as never)}
            >
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>

          {/* Latest Winning Numbers */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up" size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Latest Winning Numbers</Text>
            </View>

            {MOCK_WINNING_DRAWS.slice(0, 3).map((draw) => {
              const game = LOTTO_GAMES.find((g) => g.id === draw.gameId);
              return (
                <View key={draw.gameId} style={styles.drawCard}>
                  <View style={styles.drawHeader}>
                    <Text style={styles.drawTitle}>{game?.name}</Text>
                    <Text style={styles.drawDate}>{draw.date}</Text>
                  </View>
                  <Text style={styles.drawJackpot}>{draw.jackpot}</Text>
                  <View style={styles.drawNumbers}>
                    {draw.numbers.map((num) => (
                      <LottoBall key={num} number={num} size="sm" />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Games Available</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₱241M</Text>
              <Text style={styles.statLabel}>Total Jackpots</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
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
  scanCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanIconContainer: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 50,
    padding: 24,
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  scanSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drawCard: {
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
  drawHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  drawTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  drawDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  drawJackpot: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 12,
  },
  drawNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statsCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});
