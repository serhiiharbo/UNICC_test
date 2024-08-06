import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const Error = ({error}: {error: string}): React.ReactElement => (
  <View style={styles.error}>
    <Text style={styles.errorText}>Error: {error}</Text>
  </View>
);

Error.propTypes = {
  error: PropTypes.string,
};

Error.defaultProps = {
  error: '',
};

const styles = StyleSheet.create({
  error: {
    width: '100%',
    height: 20,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  errorText: {color: 'white'},
});

export default Error;
