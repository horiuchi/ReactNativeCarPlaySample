import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {CarPlay} from 'react-native-carplay';
import 'react-native-gesture-handler';
import {Stations} from './parkings/Stations';

const App = () => {
  const [carPlayConnected, setCarPlayConnected] = useState(CarPlay.connected);

  useEffect(() => {
    function onConnect() {
      setCarPlayConnected(true);
    }

    function onDisconnect() {
      setCarPlayConnected(false);
    }

    CarPlay.registerOnConnect(onConnect);
    CarPlay.registerOnDisconnect(onDisconnect);

    return () => {
      CarPlay.unregisterOnConnect(onConnect);
      CarPlay.unregisterOnDisconnect(onDisconnect);
    };
  });

  return carPlayConnected ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Stations lat={35.5621096} lon={139.5557698} />
    </View>
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Please connect Car Play and open the test app</Text>
    </View>
  );
};

export default App;
