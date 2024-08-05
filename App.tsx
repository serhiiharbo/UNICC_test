import React from 'react';
import {NativeModules} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {store} from './src/store/store';
import MainScreen from './src/screens/MainScreen';

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <MainScreen />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
