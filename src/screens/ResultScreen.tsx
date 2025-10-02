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
import { useRoute, useNavigation } from "@react-navigation/native";

import { LottoBall } from "../components/LottoBall";
import { LOTTO_GAMES } from "../data/lotto-data";

interface RouteParams {
  result: {
    gameId: string;
    scannedNumbers: number[];
    winningNumbers: number[];
    matchCount: number;
    prize: string;
    isWinner: boolean;
    date: string;
  };
}

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { result } = route.params as RouteParams;

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No scan result found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.navigate("Scan" as never)}
          >
            <Text style={styles.errorButtonText}>Scan a Ticket</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const game = LOTTO_GAMES.find((g) => g.id === result.gameId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={
            result.isWinner ? ["#f59e0b", "#d97706"] : ["#3b82f6", "#1d4ed8"]
          }
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons
              name={result.isWinner ? "trophy" : "sad"}
              size={40}
              color="white"
            />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                {result.isWinner ? "Congratulations!" : "Not This Time"}
              </Text>
              <Text style={styles.headerSubtitle}>
                {game?.name} - {new Date(result.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Prize Card */}
          <View
            style={[
              styles.prizeCard,
              result.isWinner && styles.prizeCardWinner,
            ]}
          >
            <Text style={styles.prizeLabel}>Your Prize</Text>
            <Text
              style={[
                styles.prizeAmount,
                result.isWinner && styles.prizeAmountWinner,
              ]}
            >
              {result.prize}
            </Text>
            {result.isWinner && (
              <Text style={styles.prizeNote}>
                Claim your prize at any authorized PCSO outlet
              </Text>
            )}
          </View>

          {/* Match Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="trophy" size={20} color="#f59e0b" />
              <Text style={styles.summaryTitle}>Match Summary</Text>
            </View>
            <Text style={styles.summaryDescription}>
              You matched {result.matchCount} out of {game?.numbers} numbers
            </Text>

            <View style={styles.numbersSection}>
              {/* Your Numbers */}
              <View style={styles.numbersGroup}>
                <Text style={styles.numbersLabel}>Your Numbers</Text>
                <View style={styles.numbersContainer}>
                  {result.scannedNumbers.map((num) => (
                    <LottoBall
                      key={num}
                      number={num}
                      isMatched={result.winningNumbers.includes(num)}
                    />
                  ))}
                </View>
              </View>

              {/* Winning Numbers */}
              <View style={styles.numbersGroup}>
                <Text style={styles.numbersLabel}>Winning Numbers</Text>
                <View style={styles.numbersContainer}>
                  {result.winningNumbers.map((num) => (
                    <LottoBall key={num} number={num} />
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Prize Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Prize Breakdown</Text>
            <View style={styles.breakdownList}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>6 Numbers Match:</Text>
                <Text style={styles.breakdownValue}>Jackpot</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>5 Numbers Match:</Text>
                <Text style={styles.breakdownValue}>₱50,000</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>4 Numbers Match:</Text>
                <Text style={styles.breakdownValue}>₱2,000</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>3 Numbers Match:</Text>
                <Text style={styles.breakdownValue}>₱150</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Scan" as never)}
            >
              <Ionicons name="scan" size={16} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => navigation.navigate("Home" as never)}
            >
              <Ionicons name="home" size={16} color="white" />
              <Text
                style={[
                  styles.actionButtonText,
                  styles.actionButtonTextPrimary,
                ]}
              >
                Go Home
              </Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  prizeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  prizeCardWinner: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  prizeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 8,
  },
  prizeAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6b7280",
  },
  prizeAmountWinner: {
    color: "#f59e0b",
  },
  prizeNote: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  numbersSection: {
    gap: 16,
  },
  numbersGroup: {
    gap: 8,
  },
  numbersLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  breakdownCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "white",
  },
  actionButtonPrimary: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
  actionButtonTextPrimary: {
    color: "white",
  },
});
