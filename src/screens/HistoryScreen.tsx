import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LottoBall } from "../components/LottoBall";
import { LOTTO_GAMES, ScanResult } from "../data/lotto-data";

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("scanHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all scan history?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("scanHistory");
              setHistory([]);
            } catch (error) {
              console.error("Error clearing history:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Ionicons name="time" size={32} color="white" />
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Scan History</Text>
                <Text style={styles.headerSubtitle}>
                  {history.length} scans recorded
                </Text>
              </View>
            </View>
            {history.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearHistory}
              >
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="scan" size={48} color="#9ca3af" />
              </View>
              <Text style={styles.emptyTitle}>No Scans Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start scanning tickets to see your history
              </Text>
            </View>
          ) : (
            <>
              {/* Summary Stats */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{history.length}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, styles.statNumberWinner]}>
                    {history.filter((h) => h.isWinner).length}
                  </Text>
                  <Text style={styles.statLabel}>Winners</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {history.filter((h) => !h.isWinner).length}
                  </Text>
                  <Text style={styles.statLabel}>No Prize</Text>
                </View>
              </View>

              {/* History List */}
              <View style={styles.historyList}>
                {history.map((scan) => {
                  const game = LOTTO_GAMES.find((g) => g.id === scan.gameId);
                  return (
                    <View
                      key={scan.id}
                      style={[
                        styles.historyCard,
                        scan.isWinner && styles.historyCardWinner,
                      ]}
                    >
                      <View style={styles.historyHeader}>
                        <View style={styles.historyHeaderLeft}>
                          <Text style={styles.historyTitle}>
                            {game?.name}
                            {scan.isWinner && (
                              <Ionicons
                                name="trophy"
                                size={16}
                                color="#f59e0b"
                                style={styles.trophyIcon}
                              />
                            )}
                          </Text>
                          <Text style={styles.historyDate}>
                            {new Date(scan.date).toLocaleString()}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.matchBadge,
                            scan.isWinner && styles.matchBadgeWinner,
                          ]}
                        >
                          <Text
                            style={[
                              styles.matchBadgeText,
                              scan.isWinner && styles.matchBadgeTextWinner,
                            ]}
                          >
                            {scan.matchCount} matches
                          </Text>
                        </View>
                      </View>

                      <View style={styles.historyNumbers}>
                        {scan.scannedNumbers.map((num) => (
                          <LottoBall
                            key={num}
                            number={num}
                            size="sm"
                            isMatched={scan.winningNumbers.includes(num)}
                          />
                        ))}
                      </View>

                      <View style={styles.historyFooter}>
                        <Text style={styles.historyPrizeLabel}>Prize:</Text>
                        <Text
                          style={[
                            styles.historyPrize,
                            scan.isWinner && styles.historyPrizeWinner,
                          ]}
                        >
                          {scan.prize}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
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
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    padding: 24,
    gap: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    backgroundColor: "#f1f5f9",
    borderRadius: 50,
    padding: 24,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statNumberWinner: {
    color: "#f59e0b",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
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
  historyCardWinner: {
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  historyHeaderLeft: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trophyIcon: {
    marginLeft: 8,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  matchBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchBadgeWinner: {
    backgroundColor: "#f59e0b",
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  matchBadgeTextWinner: {
    color: "white",
  },
  historyNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  historyPrizeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  historyPrize: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  historyPrizeWinner: {
    color: "#f59e0b",
  },
});
