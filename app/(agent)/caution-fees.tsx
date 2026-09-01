import CustomAlert from "@/components/CustomAlert";
import TopHeader from "@/components/TopHeader";
import {
  CautionFee,
  decideRefund,
  getCautionFees,
} from "@/libs/endpoints/cautionFees";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CautionFeesAgentScreen() {
  const [fees, setFees] = useState<CautionFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const fetchFees = async () => {
    try {
      const response = await getCautionFees(true); // owner=true
      if (response && response.data) {
        setFees(response.data);
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to load escrow details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFees();
  };

  const handleDecision = async (feeId: number, decision: "approve" | "dispute") => {
    setActionLoading(feeId);
    try {
      const response = await decideRefund(feeId, decision);
      if (response.status === "ok" || response.status === "success") {
        showAlert(
          "Success",
          `Refund request successfully ${decision === "approve" ? "approved" : "disputed"}!`
        );
        fetchFees(); // Refresh escrow list
      } else {
        showAlert("Failed", response.message || "Failed to submit decision.");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "An error occurred while submitting decision.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: CautionFee["status"]) => {
    let bg = "bg-gray-50 border-gray-100";
    let text = "text-gray-600";
    let label = status.replace("_", " ").toUpperCase();

    switch (status) {
      case "held":
        bg = "bg-blue-50 border-blue-100";
        text = "text-blue-600";
        break;
      case "refund_requested":
        bg = "bg-yellow-50 border-yellow-100";
        text = "text-yellow-600";
        break;
      case "approved":
        bg = "bg-purple-50 border-purple-100";
        text = "text-purple-600";
        break;
      case "refund_processing":
        bg = "bg-indigo-50 border-indigo-100";
        text = "text-indigo-600";
        break;
      case "refund_needs_attention":
        bg = "bg-orange-50 border-orange-100";
        text = "text-orange-600";
        break;
      case "refund_failed":
        bg = "bg-red-50 border-red-100";
        text = "text-red-600";
        break;
      case "refunded":
        bg = "bg-green-50 border-green-100";
        text = "text-green-600";
        break;
      case "disputed":
        bg = "bg-red-100 border-red-200";
        text = "text-red-700";
        break;
    }

    return (
      <View className={`px-3 py-1.5 rounded-full border ${bg}`}>
        <Text className={`font-poppins-semibold text-xs ${text}`}>{label}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: CautionFee }) => {
    const isPendingDecision = item.status === "refund_requested";

    return (
      <View className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-2">
            <Text className="font-poppins-semibold text-lg text-secondary" numberOfLines={1}>
              {item.property_title || `Booking #${item.booking_id}`}
            </Text>
            {item.customer_name && (
              <Text className="font-poppins text-gray-400 text-xs mt-0.5">
                Customer: {item.customer_name}
              </Text>
            )}
            <Text className="font-poppins text-gray-500 text-xs mt-0.5">
              Booking ID: {item.booking_id}
            </Text>
          </View>
          {getStatusBadge(item.status)}
        </View>

        <View className="flex-row justify-between items-center border-t border-gray-50 pt-4 mt-2">
          <View>
            <Text className="font-poppins text-gray-500 text-xs">Escrowed Fee</Text>
            <Text className="font-poppins-bold text-xl text-primary mt-0.5">
              ₦{item.amount.toLocaleString()}
            </Text>
          </View>

          {isPendingDecision && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleDecision(item.id, "dispute")}
                disabled={actionLoading !== null}
                className="bg-red-50 border border-red-100 px-3 py-2 rounded-xl"
              >
                {actionLoading === item.id ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Text className="text-red-600 font-poppins-semibold text-xs">
                    Dispute
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDecision(item.id, "approve")}
                disabled={actionLoading !== null}
                className="bg-primary px-3 py-2 rounded-xl"
              >
                {actionLoading === item.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-poppins-semibold text-xs">
                    Approve Refund
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <TopHeader title="Escrow Caution Fees" />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#C9A24D" />
        </View>
      ) : (
        <FlatList
          data={fees}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="px-4 py-4 pb-16"
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20 px-6">
              <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="shield-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="font-poppins-semibold text-lg text-secondary text-center">
                No Escrowed Fees
              </Text>
              <Text className="font-poppins text-gray-500 text-sm text-center mt-2">
                Caution fees held in escrow for your listings will be listed here.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#C9A24D"]}
              tintColor="#C9A24D"
            />
          }
        />
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}
