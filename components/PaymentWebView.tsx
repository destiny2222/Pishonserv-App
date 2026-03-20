// components/PaymentWebView.tsx
import React, { useEffect, useRef, useState } from "react";
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
    const webViewRef = useRef<WebView>(null);
    const [error, setError] = useState<string | null>(null);

    // Validate URL before rendering WebView
    const isValidUrl = (url: string): boolean => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch {
            return false;
        }
    };

    // Reset error when URL changes
    useEffect(() => {
        if (authorizationUrl) {
            setError(null);
            if (!isValidUrl(authorizationUrl)) {
                setError('Invalid payment URL. Please contact support.');
            }
        }
    }, [authorizationUrl]);
    
    // Helper function to extract reference from URL
    const extractReference = (url: string): string | null => {
        try {
            // Handle various URL formats
            let queryString = "";
            
            if (url.includes("?")) {
                queryString = url.split("?")[1];
            } else if (url.includes("&")) {
                // URL might have params without ? (unlikely but handle it)
                queryString = url;
            }
            
            if (!queryString) return null;
            
            const urlParams = new URLSearchParams(queryString);
            
            // Try different parameter names used by payment providers
            const reference = urlParams.get("reference") 
                || urlParams.get("trxref") 
                || urlParams.get("ref")
                || urlParams.get("tx_ref")
                || urlParams.get("transaction_id");
                
            return reference;
        } catch (error) {
           
            return null;
        }
    };

    const handleNavigationChange = (navState: any) => {
        const { url } = navState;
        
        if (!url || url.startsWith("about:blank")) {
            return;
        }

        

        // Handle payment cancellation/failure
        const lowerUrl = url.toLowerCase();
        if (
            lowerUrl.includes("cancel") ||
            lowerUrl.includes("close") ||
            lowerUrl.includes("failed") ||
            lowerUrl.includes("error") ||
            lowerUrl.includes("abandon")
        ) {
            onClose();
            return;
        }

        // Handle successful payment - check for callback/verification URLs
        if (
            lowerUrl.includes("callback") || 
            lowerUrl.includes("verify") || 
            lowerUrl.includes("reference=") ||
            lowerUrl.includes("trxref=") ||
            lowerUrl.includes("transaction_id=")
        ) {
            const reference = extractReference(url);
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

    const handleShouldStartLoadWithRequest = (request: any) => {
        const { url } = request;
        
        if (!url || url.startsWith("about:blank")) {
            return true;
        }

        const lowerUrl = url.toLowerCase();

        // Handle cancellation
        if (
            lowerUrl.includes("cancel") ||
            lowerUrl.includes("close") ||
            lowerUrl.includes("failed") ||
            lowerUrl.includes("error") ||
            lowerUrl.includes("abandon")
        ) {
            onClose();
            return false;
        }

        // Handle successful payment
        if (
            lowerUrl.includes("callback") || 
            lowerUrl.includes("verify") || 
            lowerUrl.includes("reference=") ||
            lowerUrl.includes("trxref=") ||
            lowerUrl.includes("transaction_id=")
        ) {
            const reference = extractReference(url);
            if (reference) {
                onSuccess(reference);
                return false;
            }
        }
        
        return true;
    };

    const handleMessage = (event: any) => {
        try {
            const data = event.nativeEvent.data;
           
            
            if (data === "window.close" || data === "close") {
                onClose();
            }
        } catch (error) {
            
        }
    };

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
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

                {/* Error State */}
                {error ? (
                    <View className="flex-1 justify-center items-center bg-white p-6">
                        <Ionicons name="alert-circle" size={64} color="#EF4444" />
                        <Text className="mt-4 text-lg font-poppins-bold text-gray-800 text-center">
                            Payment Error
                        </Text>
                        <Text className="mt-2 text-gray-600 font-poppins text-center">
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="mt-6 bg-primary px-8 py-3 rounded-full"
                        >
                            <Text className="text-white font-poppins-bold">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : !authorizationUrl ? (
                    <View className="flex-1 justify-center items-center bg-white p-6">
                        <ActivityIndicator size="large" color="#C9A24D" />
                        <Text className="mt-3 text-gray-500 font-poppins">
                            Preparing payment...
                        </Text>
                    </View>
                ) : (
                /* Paystack WebView */
                <WebView
                    ref={webViewRef}
                    source={{ uri: authorizationUrl }}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onNavigationStateChange={handleNavigationChange}
                    onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={false}
                    mediaPlaybackRequiresUserAction={true}
                    allowsBackForwardNavigationGestures={false}
                    cacheEnabled={false}
                    className="flex-1"
                    bounces={true}
                    scalesPageToFit={true}
                />
                )}
            </View>
        </Modal>
    );
};

export default PaymentWebView;
