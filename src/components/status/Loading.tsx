import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Loading = (): React.ReactElement => (
  <View style={styles.loading}>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loading: {
    width: '100%',
    height: 20,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  loadingText: {color: 'white'},
});

export default Loading;
