import CustomAlert from "@/components/CustomAlert";
import TopHeader from "@/components/TopHeader";
import {
  CautionFee,
  getCautionFees,
  requestRefund,
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

export default function CautionFeesCustomerScreen() {
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
      const response = await getCautionFees(false);
      if (response && response.data) {
        setFees(response.data);
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to load caution fees");
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

  const handleRefundRequest = async (feeId: number) => {
    setActionLoading(feeId);
    try {
      const response = await requestRefund(feeId);
      if (response.status === "ok" || response.status === "success") {
        showAlert("Success", response.message || "Refund request submitted successfully!");
        fetchFees(); // Refresh status
      } else {
        showAlert("Refund Request Failed", response.message || "Failed to submit request.");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "An error occurred while requesting refund.");
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
    return (
      <View className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-2">
            <Text className="font-poppins-semibold text-lg text-secondary" numberOfLines={1}>
              {item.property_title || `Booking #${item.booking_id}`}
            </Text>
            <Text className="font-poppins text-gray-500 text-xs mt-0.5">
              Booking ID: {item.booking_id}
            </Text>
          </View>
          {getStatusBadge(item.status)}
        </View>

        <View className="flex-row justify-between items-center border-t border-gray-50 pt-4 mt-2">
          <View>
            <Text className="font-poppins text-gray-500 text-xs">Caution Fee Amount</Text>
            <Text className="font-poppins-bold text-xl text-primary mt-0.5">
              ₦{item.amount.toLocaleString()}
            </Text>
          </View>

          {item.can_request_refund && item.status === "held" && (
            <TouchableOpacity
              onPress={() => handleRefundRequest(item.id)}
              disabled={actionLoading !== null}
              className="bg-primary px-4 py-2.5 rounded-xl flex-row items-center justify-center"
            >
              {actionLoading === item.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="receipt-outline" size={16} color="#fff" className="mr-1" />
                  <Text className="text-white font-poppins-semibold text-sm">
                    Request Refund
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <TopHeader title="Refundable Caution Fees" />

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
                No Caution Fees Found
              </Text>
              <Text className="font-poppins text-gray-500 text-sm text-center mt-2">
                Your refundable caution fees will appear here once booking is initialized.
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
