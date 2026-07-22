import React from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';

interface AppRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export const AppRefreshControl = ({ refreshing, onRefresh }: AppRefreshControlProps) => (
  <RNRefreshControl
    refreshing={refreshing}
    onRefresh={onRefresh}
    colors={['#C9A24D']}
    tintColor="#C9A24D"
    title="Pull to refresh"
    titleColor="#6B7280"
  />
);

export default AppRefreshControl;
