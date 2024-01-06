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
  Modal,
  TouchableOpacity,
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
  const [showRatesModal, setShowRatesModal] = useState(false);

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

    const refreshInterval = setInterval(() => {
      fetchIPOData();
      fetchForexRates();
    }, 60000);

    return () => clearInterval(refreshInterval);
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

  const handleRefresh = () => {
    fetchIPOData();
    fetchForexRates();
  };

  const handleClickRates = () => {
    setShowRatesModal(true);
  };

  const handleCloseRates = () => {
    setShowRatesModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>IPO DASHBOARD</Text>
      </View>
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
              <Text style={styles.subHeading}>Upcoming IPOs</Text>
              <View style={styles.ipoCardsContainer}>
                {ipoData.map((ipo, index) => (
                  <IPOCard key={index} ipo={ipo} onCardClick={handleCardClick} />
                ))}
              </View>
              <Button title="Refresh Data" onPress={handleRefresh} />
            </View>
            <View style={styles.forexRates}>
              
              <Button title="View Forex Rates" onPress={handleClickRates} />
            </View>
          </View>
        ) : (
          <View style={styles.landingPageContainer}>
            {showLogin && (
              <View style={styles.loginContainer}>
                <Text style={styles.subHeading}>Login</Text>
                <Login onLogin={handleLogin} />
              </View>
            )}
            <View style={styles.registrationContainer}>
              <Text style={styles.subHeading}>Register</Text>
              {showRegister && <Registration onRegistration={handleRegistration} />}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showRatesModal}
        onRequestClose={handleCloseRates}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ExchangeRatesTable rates={forexRates} />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseRates}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  headerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'maroon',
    color: 'white',
    padding: 10,
    borderRadius: 8,
  },
  dashboardText: {
    fontSize: 18,
  },
  main: {
    flex: 1,
  },
  dashboard: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {},
  ipoList: {
    flex: 2,
    marginLeft: width > height ? width * 0.1 : 0,
  },
  ipoCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  forexRates: {
    height:35,
    marginLeft: width > height ? width * 0.1 : 0,
    marginTop: 0,
    backgroundColor: '#ffc',
    borderRadius: 3,
 
    borderColor: '#ddd',
    borderWidth: 1,
  },
  landingPageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    margin: 10,
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
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: width * 0.9,
    height: height * 0.8,
  },
  closeButton: {
    backgroundColor: 'maroon',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
