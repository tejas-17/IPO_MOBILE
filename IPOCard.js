// IPOCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
        <Text>Symbol: {ipo.symbol}</Text>
        <Text>Offering Date: {ipo.offeringDate}</Text>
        <Text>Price Range: ${ipo.priceRangeLow} - ${ipo.priceRangeHigh}</Text>
        <Text>Minimum Investment: ${ipo.priceRangeLow}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ipoCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  ipoCardPressed: {
    opacity: 0.8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IPOCard;
