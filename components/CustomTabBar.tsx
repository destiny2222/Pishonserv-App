import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
} from 'react-native-reanimated';
import { Home, Search, User, ShoppingCart, SolarPanel } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  
  // Filter for allowed routes
  const visibleRoutes = useMemo(() => {
    const allowedRoutes = ['home', 'search', 'solar', 'cart', 'profile'];
    return state.routes.filter(route => {
      const { options } = descriptors[route.key];
      return options.href !== null && allowedRoutes.includes(route.name);
    });
  }, [state.routes, descriptors]);

  const translateX = useSharedValue(0);
  
  // paddingHorizontal: 1 is used in styles.tabBarMain
  const TAB_BAR_PADDING = 1;
  const contentWidth = barWidth - (TAB_BAR_PADDING * 2);
  const tabWidth = contentWidth > 0 ? contentWidth / visibleRoutes.length : 0;
  
  // Pill dimensions
  const pillWidth = tabWidth > 14 ? tabWidth - 14 : tabWidth; // Padding inside the slot

  useEffect(() => {
    const activeRoute = state.routes[state.index];
    const visibleIndex = visibleRoutes.findIndex(r => r.key === activeRoute.key);
    
    if (visibleIndex !== -1 && tabWidth > 0) {
      // Calculate start position: padding + index * tabWidth + margin for centering
      const startPos = TAB_BAR_PADDING + (visibleIndex * tabWidth) + (tabWidth - pillWidth) / 2;
      translateX.value = withSpring(startPos, {
         damping: 15,
         stiffness: 120,
      });
    }
  }, [state.index, tabWidth, visibleRoutes, pillWidth]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: barWidth > 0 ? 1 : 0,
  }));

  const getIcon = (name: string, color: string, isFocused: boolean) => {
    const size = 24;
    const icons = {
      home: Home,
      search: Search,
      solar: SolarPanel,
      cart: ShoppingCart,
      profile: User,
    };
    
    const IconComponent = icons[name];
    if (!IconComponent) return null;

    const scale = useSharedValue(isFocused ? 1.2 : 1);

    useEffect(() => {
      scale.value = withSpring(isFocused ? 1.2 : 1, {
        stiffness: 200,
        damping: 10
      });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View style={animatedIconStyle}>
        <IconComponent size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
      <View 
        style={styles.tabBarMain}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {/* Animated Background Pill */}
        {tabWidth > 0 && (
          <Animated.View 
            style={[
              styles.activePill, 
              { width: pillWidth },
              animatedPillStyle
            ]} 
          />
        )}

        {visibleRoutes.map((route) => {
          const isFocused = state.routes[state.index].key === route.key;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {getIcon(route.name, isFocused ? '#FFFFFF' : '#6B7280', isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarMain: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    height: 70,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  activePill: {
    position: 'absolute',
    height: 50,
    backgroundColor: '#C9A24D',
    borderRadius: 25,
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default CustomTabBar;
