import React from 'react';
import {NativeModules, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';

import {persistor, store} from './src/store/store';
import MainScreen from './src/screens/MainScreen';

if (__DEV__ && Platform.OS === 'ios') {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainScreen />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
