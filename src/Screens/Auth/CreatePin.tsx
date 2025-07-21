import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CreatePinProps } from '../../Types/navigation';

const CreatePin: React.FC<CreatePinProps> = ({ navigation }) => {
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string>('');

  const handleNumberPress = (number: string) => {
    if (isConfirming) {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + number);
      }
    } else {
      if (pin.length < 4) {
        setPin(pin + number);
      }
    }
    setError('');
  };

  const handleBackspace = () => {
    if (isConfirming) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
    setError('');
  };

  useEffect(() => {
    if (!isConfirming && pin.length === 4) {
      setTimeout(() => {
        setIsConfirming(true);
      }, 500);
    }
  }, [pin, isConfirming]);

  useEffect(() => {
    if (isConfirming && confirmPin.length === 4) {
      if (pin === confirmPin) {
        setTimeout(() => {
          navigation.navigate('SetFingerprint');
        }, 500);
      } else {
        setError('PINs do not match');
        Vibration.vibrate(500);
        setTimeout(() => {
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
          setError('');
        }, 1500);
      }
    }
  }, [confirmPin, pin, isConfirming, navigation]);

  const handleBackPress = () => {
    if (isConfirming) {
      setIsConfirming(false);
      setConfirmPin('');
      setError('');
    } else {
      navigation.goBack();
    }
  };

  const renderPinDots = () => {
    const currentPin = isConfirming ? confirmPin : pin;
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < currentPin.length && styles.pinDotFilled,
              error && styles.pinDotError,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ];

    return (
      <View style={styles.keypadContainer}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((number, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.keypadButton,
                  number === '' && styles.keypadButtonEmpty,
                ]}
                onPress={() => {
                  if (number === '⌫') {
                    handleBackspace();
                  } else if (number !== '') {
                    handleNumberPress(number);
                  }
                }}
                disabled={number === ''}
              >
                <Text style={styles.keypadButtonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create New PIN</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {isConfirming
              ? 'Confirm your PIN'
              : 'Add a PIN number to make your account more secure'}
          </Text>
        </View>

        {renderPinDots()}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {renderKeypad()}

        <TouchableOpacity
          style={styles.continueButtonContainer}
          onPress={() => navigation.navigate('SetFingerprint')}
          disabled={pin.length !== 4}
        >
          <LinearGradient
            colors={pin.length === 4 ? ['#8B5CF6', '#A855F7'] : ['rgba(139, 92, 246, 0.3)', 'rgba(168, 85, 247, 0.3)']}
            style={styles.continueButton}
          >
            <Text style={[
              styles.continueButtonText,
              pin.length !== 4 && styles.continueButtonTextDisabled
            ]}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pinDotFilled: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  pinDotError: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  keypadContainer: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 400,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keypadButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  continueButtonContainer: {
    marginTop: 30,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',

  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default CreatePin;