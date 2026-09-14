import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Updates from 'expo-updates';
import Ionicons from '@expo/vector-icons/Ionicons';

export function UpdateChecker() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Only check for updates in production (not in development mode)
        if (__DEV__) return;

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          // Download the update in the background
          await Updates.fetchUpdateAsync();
          // Prompt the user with the custom modal once downloaded
          setModalVisible(true);
        }
      } catch (error) {
        // console.error('Error checking for updates:', error);
      }
    }

    checkForUpdates();
  }, []);

  const handleRestart = async () => {
    try {
      setIsApplying(true);
      await Updates.reloadAsync();
    } catch (error) {
      // console.error('Error reloading app:', error);
      setIsApplying(false);
      setModalVisible(false);
    }
  };

  const handleDismiss = () => {
    setModalVisible(false);
  };

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Glowing Badge Icon */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconInner}>
              <Ionicons name="sparkles" size={26} color="#C9A24D" />
            </View>
          </View>

          {/* Tag Pill */}
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>UPDATE AVAILABLE</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>New Version Ready!</Text>

          {/* Message */}
          <Text style={styles.message}>
            We've improved property pricing, payment transparency, and app performance. Restart now to apply the latest updates.
          </Text>

          {/* Highlight Bullets */}
          <View style={styles.highlightsContainer}>
            <View style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.highlightText}>Full payable pricing breakdown</Text>
            </View>
            <View style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.highlightText}>Refundable caution escrow details</Text>
            </View>
            <View style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.highlightText}>Performance and stability upgrades</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRestart}
              disabled={isApplying}
              activeOpacity={0.85}
            >
              {isApplying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>Restart to Apply</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleDismiss}
              disabled={isApplying}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#F3E8D0',
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F7EDD6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagPill: {
    backgroundColor: 'rgba(201, 162, 77, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  tagPillText: {
    fontSize: 10,
    fontFamily: 'poppins-bold',
    color: '#9C7A2E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontFamily: 'poppins-bold',
    color: '#191D31',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    fontFamily: 'poppins',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  highlightsContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: 'poppins-medium',
    color: '#374151',
    flex: 1,
  },
  actions: {
    width: '100%',
    gap: 6,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#C9A24D',
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9A24D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: 'poppins-bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontFamily: 'poppins-medium',
    color: '#9CA3AF',
  },
});

