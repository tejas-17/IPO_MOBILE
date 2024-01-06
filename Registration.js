import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const Registration = ({ onRegistration }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleRegistration = () => {
    if (username.trim() === '' || password.trim() === '') {
      showToast('Please enter both username and password.');
      return;
    }

    // Simple password rule: at least 6 characters
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    onRegistration({ username, password });
  };

  const showToast = (message) => {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: 'Error',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      bottomOffset: 40,
    });
  };

  const handlePasswordChange = (text) => {
    // Implement your own password strength logic here
    // For simplicity, we'll just check if the length is greater than 5 and less than 10
    const strength = text.length > 5 && text.length < 10 ? 1 : 0;
    setPasswordStrength(strength);
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      <View style={styles.passwordStrength}>
        <Text>Password Strength: </Text>
        <View style={[styles.strengthIndicator, { width: `${passwordStrength * 25}%` }]} />
      </View>
      <Button title="Register" onPress={handleRegistration} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  strengthIndicator: {
    height: 10,
    backgroundColor: 'green',
  },
});

export default Registration;
