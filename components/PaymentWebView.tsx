// components/PaymentWebView.tsx
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { WebView } from "react-native-webview";

import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    visible: boolean;
    authorizationUrl: string;
    onSuccess: (reference: string) => void;
    onClose: () => void;
}

const PaymentWebView = ({ visible, authorizationUrl, onSuccess, onClose }: Props) => {
    const [loading, setLoading] = useState(true);
    const handleNavigationChange = (navState: any) => {
        const { url } = navState;

        // Handle Paystack "cancel" or "close" or "failed" redirects
        if (
            url.includes("cancel") ||
            url.includes("close") ||
            url.includes("failed") ||
            url.includes("error") ||
            url === "about:blank"
        ) {
            onClose();
            return;
        }

        // Paystack redirects to this URL after payment
        if (url.includes("callback") || url.includes("verify") || url.includes("reference=")) {
            // Extract reference from URL
            const urlParams = new URLSearchParams(url.split("?")[1]);
            const reference = urlParams.get("reference") || urlParams.get("trxref");

            if (reference) {
                onSuccess(reference);
            }
        }
    };

    const handleClosePress = () => {
        Alert.alert(
            "Cancel Payment?",
            "Are you sure you want to cancel? Your booking will not be confirmed.",
            [
                {
                    text: "Go Back",
                    style: "cancel",
                    onPress: () => { },
                },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: onClose,
                },
            ]
        );
    };

    // Removed handleConfirmCancel

    const handleShouldStartLoadWithRequest = (request: any) => {
        const { url } = request;
        const lowerUrl = url.toLowerCase();

        if (
            lowerUrl.includes("cancel") ||
            lowerUrl.includes("close") ||
            lowerUrl.includes("failed") ||
            lowerUrl.includes("error") ||
            lowerUrl === "about:blank"
        ) {
            onClose();
            return false; // Prevent loading the cancel URL
        }

        if (lowerUrl.includes("callback") || lowerUrl.includes("verify") || lowerUrl.includes("reference=")) {
            const urlParams = new URLSearchParams(url.split("?")[1]);
            const reference = urlParams.get("reference") || urlParams.get("trxref");
            if (reference) {
                onSuccess(reference);
                return false; // Prevent loading the success URL
            }
        }
        return true;
    };

    const injectedJavaScript = `
      (function() {
        // Override window.close
        window.close = function() {
          window.ReactNativeWebView.postMessage("window.close");
        };

        // Listen for postMessages from Paystack
        window.addEventListener("message", function(event) {
          if (event.data && (event.data === "close" || event.data.event === "close")) {
             window.ReactNativeWebView.postMessage("window.close");
          }
        });
      })();
    `;

    const handleMessage = (event: any) => {
        if (event.nativeEvent.data === "window.close") {
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                {/* Header */}
                <View
                    className="flex-row items-center justify-between px-5 bg-white border-b border-gray-200"
                    style={{ paddingTop: Platform.OS === "ios" ? 55 : 40, paddingBottom: 12 }}
                >
                    <Text className="text-lg font-poppins-bold text-secondary">
                        Complete Payment
                    </Text>
                    <TouchableOpacity
                        onPress={handleClosePress}
                        className="bg-gray-300 rounded-full p-2"
                    >
                        <Ionicons name="close" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Loading Indicator */}
                {loading && (
                    <View className="absolute inset-0 justify-center items-center z-10 bg-white">
                        <ActivityIndicator size="large" color="#C9A24D" />
                        <Text className="mt-3 text-gray-500 font-poppins">
                            Loading payment page...
                        </Text>
                    </View>
                )}

                {/* Paystack WebView */}
                <WebView
                    source={{ uri: authorizationUrl }}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationChange}
                    onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={handleMessage}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    originWhitelist={['*']}
                    className="flex-1"
                />
            </View>
            {/* Removed CustomAlert component */}
        </Modal>
    );
};

export default PaymentWebView;