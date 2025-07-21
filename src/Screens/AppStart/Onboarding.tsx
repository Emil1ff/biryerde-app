import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { OnboardingProps } from '../../Types/navigation';
import Content1 from '../../Components/Onboarding/Content1';
import Content2 from '../../Components/Onboarding/Content2';
import Content3 from '../../Components/Onboarding/Content3';
import PaginationDots from '../../Components/Onboarding/PaginationDots';


const { width, height } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  component: React.ComponentType<OnboardingContentProps>;
}

interface OnboardingContentProps {
  onNext: () => void;
  onGetStarted: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onboardingData: OnboardingData[] = [
    { id: 1, component: Content1 },
    { id: 2, component: Content2 },
    { id: 3, component: Content3 },
  ];

  const animateTransition = (direction: 'next' | 'prev') => {
    const toValue = direction === 'next' ? -width : width;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(direction === 'next' ? width : -width);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = (): void => {
    if (currentIndex < onboardingData.length - 1) {
      animateTransition('next');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };

  const handleGetStarted = (): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Auth', { fromOnboarding: true });
    });
  };

  const CurrentComponent = onboardingData[currentIndex].component;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [
                { translateX: slideAnim },
                { scale: scaleAnim },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <CurrentComponent 
            onNext={handleNext}
            onGetStarted={handleGetStarted}
          />
        </Animated.View>
        
        <PaginationDots 
          currentIndex={currentIndex} 
          totalDots={onboardingData.length} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  contentContainer: {
    flex: 1,
  },
});

export default Onboarding;

