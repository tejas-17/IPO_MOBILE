// IPOCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const IPOCard = ({ ipo, onCardClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleCardPressIn = () => {
    setIsPressed(true);
  };

  const handleCardPressOut = () => {
    setIsPressed(false);
  };

  const handleCardClick = () => {
    onCardClick(ipo);
  };

  return (
    <TouchableOpacity
      onPress={handleCardClick}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
    >
      <View
        style={[
          styles.ipoCard,
          isPressed ? styles.ipoCardPressed : null,
        ]}
      >
        <Text style={styles.companyName}>{ipo.companyName}</Text>
        <Text style={styles.symbol}>Symbol: {ipo.symbol}</Text>
        <Text>Date: {ipo.offeringDate}</Text>
        <Text>Price Range: ${ipo.priceRangeLow} - ${ipo.priceRangeHigh}</Text>
        <Text>Min Investment: ${ipo.priceRangeLow}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ipoCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: width > height ? width * 0.4 : width * 0.8,
  },
  ipoCardPressed: {
    opacity: 0.8,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 11,
    color: '#555',
    fontWeight: 'bold'
    
  },
});

export default IPOCard;
