import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import Chat from './components/Chat';
import Start from './components/Start';

const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCCSFps_TgqdYs1vn5mqBrjj9D7GcIzB9A',
    authDomain: 'chatapp-5d5f3.firebaseapp.com',
    projectId: 'chatapp-5d5f3',
    storageBucket: 'chatapp-5d5f3.firebasestorage.app',
    messagingSenderId: '822380518230',
    appId: '1:822380518230:web:dae89c1e2990daedfd94f7',
  };

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {(props) => <Start db={db} app={app} auth={auth} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
