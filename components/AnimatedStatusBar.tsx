import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedStatusBarProps {
  barStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
  animated?: boolean;
}

const AnimatedStatusBar: React.FC<AnimatedStatusBarProps> = ({ 
  barStyle = 'dark-content', 
  backgroundColor = 'transparent',
  animated = true 
}) => {
  const insets = useSafeAreaInsets();
  
  // Animation for background color transition
  const animatedBackground = useSharedValue(0);
  
  useEffect(() => {
    if (animated) {
      animatedBackground.value = withTiming(1, { duration: 300 });
    } else {
      animatedBackground.value = 1;
    }
  }, [animated, backgroundColor]);

  const animatedStyle = useAnimatedStyle(() => {
    const background = interpolateColor(
      animatedBackground.value,
      [0, 1],
      ['transparent', backgroundColor]
    );
    
    return {
      backgroundColor: background,
    };
  });

  return (
    <>
      <StatusBar style={barStyle} />
    </>
  );
};

export default AnimatedStatusBar;
