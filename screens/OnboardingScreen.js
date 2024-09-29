import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Image
            source={require('../img/flame-sensor.png')} // Adjust the path to your image
            style={styles.image}
        />
      <Text style={styles.title}>Flame Sensor</Text>
      <Text style={styles.quote}>the silent guardian, detecting the unseen to protect us</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(177, 136, 239, 0.2)', // Change the background color here
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#5a189a', // Optional: text color
    fontWeight: 'bold',
  },
  quote: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 50,
    marginBottom: 50,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30, // Adjust margin if needed
  },
  button: {
    backgroundColor: '#8400e2', // Button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Android elevation property
    elevation: 8,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 18,
  },
});

export default OnboardingScreen;
