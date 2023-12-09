import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import AlbumsScreen from './screens/Albums/Screen';
import AlbumViewScreen from './screens/AlbumView/Screen';
import BucketsScreen from './screens/Buckets/Screen';
import { registerRootComponent } from 'expo';
import TaskManager from './components/TaskManager';
import TasksScreen from './screens/Tasks/Screen';


const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Albums" component={AlbumsScreen} />
      <Tab.Screen name="Buckets" component={BucketsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <TaskManager>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Album"
              component={AlbumViewScreen}
              options={({ route }) => ({ title: route.params.album.title })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </TaskManager>

  );
}

registerRootComponent(App);