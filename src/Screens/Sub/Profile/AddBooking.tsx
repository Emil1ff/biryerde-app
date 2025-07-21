'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AddBookingScreenProps } from '../../../Types/navigation';

const AddBookingScreen: React.FC = () => {
  const navigation = useNavigation<AddBookingScreenProps['navigation']>();
  const [serviceName, setServiceName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddBooking = () => {
    if (serviceName && providerName && date && time && duration) {
      Alert.alert(
        'Rezervasyon Eklendi',
        `${serviceName} için rezervasyonunuz başarıyla eklendi.`,
      );
      navigation.goBack();
    } else {
      Alert.alert('Hata', 'Lütfen gerekli tüm alanları doldurun.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Booking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Service Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. House Cleaning"
            placeholderTextColor="#B0BEC5"
            value={serviceName}
            onChangeText={setServiceName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Provider Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jenny Wilson"
            placeholderTextColor="#B0BEC5"
            value={providerName}
            onChangeText={setProviderName}
          />
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#B0BEC5"
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM AM/PM"
              placeholderTextColor="#B0BEC5"
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Duration (hours)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2 hours"
            placeholderTextColor="#B0BEC5"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Additional notes..."
            placeholderTextColor="#B0BEC5"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddBooking}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Create Booking</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#212121',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  addButton: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  addButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddBookingScreen;
