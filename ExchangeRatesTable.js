// ExchangeRatesTable.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ExchangeRatesTable = ({ rates }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.headerCell}>Currency</Text>
          <Text style={styles.headerCell}>Rate</Text>
        </View>
        {rates.map((rate) => (
          <View style={styles.tableRow} key={rate.symbol}>
            <Text style={styles.cell}>{rate.symbol}</Text>
            <Text style={styles.cell}>{rate.rate}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'column',
    width: width * 0.9,
    maxHeight: 60,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  cell: {
    fontSize: 12,
  },
});

export default ExchangeRatesTable;
