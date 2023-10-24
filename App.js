// Navigation.js
import * as React from 'react';
import HomeScreen from './screens/Screen1'
import Screen2 from './screens/Register'
import Screen3 from './screens/Display'
import Screen4 from './screens/Update'
import Screen5 from './screens/FaceRecognition'
import Attendence from './screens/Attendence'
import Search from './screens/Search'
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Stack = createNativeStackNavigator()
function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerTitle:'REGISTER',
                                headerTitleAlign:'center',
                                headerTintColor:'black',
                                headerTitleStyle:{
                                  fontWeight:'900',
                                  fontSize:22,
                                },
                                headerStyle:{
                                  backgroundColor:'#dfb266',}}} name="Register" component={Screen2} />
      <Stack.Screen  options={{ headerTitle:'DISPLAY',
                                headerTitleAlign:'center',
                                headerTintColor:'black',
                                headerTitleStyle:{
                                  fontWeight:'900',
                                  fontSize:22,
                                },
                                headerStyle:{
                                  backgroundColor:'#dfb266',
                                }}} 
                                name="Display" component={Screen3} />
      <Stack.Screen  options={{ headerTitle:'ATTENDENCE',
                                headerTitleAlign:'center',
                                headerTintColor:'black',
                                headerTitleStyle:{
                                  fontWeight:'900',
                                  fontSize:22,
                                },
                                headerStyle:{
                                  backgroundColor:'#dfb266',
                                }}} 
                                name="Attendence" component={Attendence} />
      <Stack.Screen  options={{ headerTitle:'Search',
                                headerTitleAlign:'center',
                                headerTintColor:'black',
                                headerTitleStyle:{
                                  fontWeight:'900',
                                  fontSize:22,
                                },
                                headerStyle:{
                                  backgroundColor:'#dfb266',
                                }}} 
                                name="Search" component={Search} />
    </Stack.Navigator>
  );
}

export default function App() { 
  return ( 
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Screen1"> 
        <Stack.Screen options={{
          headerTitle:'FACE RECOGNITION',
          headerTitleAlign:'center',
          headerLeft:()=>(
            <MaterialCommunityIcons
                name="face-recognition"
                size={35}
                color="#9966ff"
                style={{alignSelf:'center'}}
            />
          ),
          headerTintColor:'black',
          headerTitleStyle:{
            fontWeight:'900',
            fontSize:22,
          },
          headerStyle:{
            backgroundColor:'#dfb266',
          }
         }}
         name="HomeScreen" component = {HomeScreen} 
        /> 
        <Stack.Screen options={{headerShown:false}} name="Root" component = {Root} />  
        <Stack.Screen  options={{ headerTitle:'UPDATE',
                                  headerTitleAlign:'center',
                                  headerTintColor:'black',
                                  headerTitleStyle:{
                                    fontWeight:'900',
                                    fontSize:22,
                                  },
                                  headerStyle:{
                                    backgroundColor:'#dfb266',
                                  }}} 
                                  name="Update" component={Screen4} />
        <Stack.Screen name='FaceRecognition' component={Screen5} />
      </Stack.Navigator> 
    </NavigationContainer> 
  );
}


