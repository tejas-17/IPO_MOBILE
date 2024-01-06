// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import IPOCard from './IPOCard';
import ExchangeRatesTable from './ExchangeRatesTable';
import Registration from './Registration';
import Login from './Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [user, setUser] = useState(null);
  const [ipoData, setIpoData] = useState([]);
  const [forexRates, setForexRates] = useState([]);
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('registeredUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setShowLogin(false);
          setShowRegister(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchIPOData();
    fetchForexRates();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const storedUser = await AsyncStorage.getItem('registeredUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.username === username && parsedUser.password === password) {
          setUser(parsedUser);
          setShowLogin(false);
          setShowRegister(false);
        } else {
          alert('Invalid login credentials');
        }
      } else {
        alert('User not registered');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setShowRegister(true);
  };

  const handleRegistration = async (newUser) => {
    try {
      await AsyncStorage.setItem('registeredUser', JSON.stringify(newUser));
      setUser(newUser);
      setLoginUsername('');
      setLoginPassword('');
      setShowLogin(false);
      setShowRegister(false);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const fetchIPOData = async () => {
    try {
      const response = await fetch('https://api.iex.cloud/v1/data/CORE/UPCOMING_IPOS/market?token=pk_783dcc2169924a7a9f17a4b0b13bca6c');
      const data = await response.json();
      setIpoData(data);
    } catch (error) {
      console.error('Error fetching IPO data:', error);
    }
  };

  const fetchForexRates = async () => {
    try {
      const response = await fetch('https://api.iex.cloud/v1/fx/latest?symbols=USDCAD,GBPUSD,USDJPY&token=pk_783dcc2169924a7a9f17a4b0b13bca6c');
      const data = await response.json();
      setForexRates(data);
    } catch (error) {
      console.error('Error fetching forex rates:', error);
    }
  };

  const handleCardClick = (ipo) => {
    setSelectedIPO(ipo);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>IPO DASHBOARD</Text>
      {user && (
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardText}>
            Welcome, {user.username}!
          </Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.main}
      >
        {user ? (
          <View style={styles.dashboard}>
            <View style={styles.column}></View>
            <View style={styles.ipoList}>
              <Text style={styles.heading}>Upcoming IPOs</Text>
              <View style={styles.ipoCardsContainer}>
                {ipoData.map((ipo) => (
                  <IPOCard key={ipo.symbol} ipo={ipo} onCardClick={handleCardClick} />
                ))}
              </View>
            </View>
            <View style={styles.forexRates}>
              <ExchangeRatesTable rates={forexRates} />
            </View>
          </View>
        ) : (
          <View style={styles.landingPageContainer}>
            {showLogin && (
              <View style={styles.loginContainer}>
                <Text style={styles.heading}>Login</Text>
                <Login onLogin={handleLogin} />
              </View>
            )}
            <View style={styles.registrationContainer}>
              <Text style={styles.heading}>Register</Text>
              {showRegister && <Registration onRegistration={handleRegistration} />}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    width: width * 0.9,
  },
  dashboardText: {
    fontSize: 18,
  },
  main: {
    flex: 1,
    width: width * 0.9,
  },
  dashboard: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {},
  ipoList: {
    flex: 2,
    marginLeft: width > height ? width * 0.05 : 0,
    width: width * 0.9,
  },
  ipoCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  forexRates: {
    flex: 1,
    marginLeft: width > height ? width * 0.05 : 0,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  landingPageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    width: width * 0.9,
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: 20,
    width: width * 0.9,
  },
  registrationContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: 20,
    width: width * 0.9,
  },
});

export default App;
