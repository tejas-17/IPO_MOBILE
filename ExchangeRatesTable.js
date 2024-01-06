// ExchangeRatesTable.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExchangeRatesTable = ({ rates }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.heading}>Foreign Exchange Rates</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>Currency Pair</Text>
          <Text style={styles.headerCell}>Exchange Rate</Text>
        </View>
        {rates.map(({ symbol, rate }) => (
          <View key={symbol} style={styles.row}>
            <Text style={styles.cell}>{getCurrencyPairLabel(symbol)}</Text>
            <Text style={styles.cell}>{rate}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const getCurrencyPairLabel = (symbol) => {
  const currencyPairs = {
    USDCAD: 'US Dollar to Canadian Dollar',
    GBPUSD: 'British Pound to US Dollar',
    USDJPY: 'US Dollar to Japanese Yen',
    // Add more currency pairs as needed
  };

  return currencyPairs[symbol] || symbol;
};

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  table: {
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: 'green',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
  },
});

export default ExchangeRatesTable;
