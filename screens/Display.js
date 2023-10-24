import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet,Button, Pressable,Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import {Asset} from "expo-asset";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


async function openDatabase() {     //common function used for connecting and opening the database and table      
                                    //this full function must be used for connecting database

    const dbPath = FileSystem.documentDirectory + 'SQLite/'; 
    if (!(await FileSystem.getInfoAsync(dbPath)).exists) {
      await FileSystem.makeDirectoryAsync(dbPath);
    }
    
    const databaseAsset = Asset.fromModule(require('../assets/database/student.db'));
    await databaseAsset.downloadAsync();
    
    return SQLite.openDatabase('student.db');
  }
  const initializeDatabase = async () => {              //to return the db to open
    const db = await openDatabase();
    return db;
  };

export default function DisplayDataScreen({navigation}){

  function Delete() {
    const db = SQLite.openDatabase('student.db');
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM student',
        [],
        (_, result) => {
          console.log("Fully Deleted");
        },
      );
    });            //it calls the refresh function for refreshing and removing deleted element 
  }
    function ClearList(){                   //used as main delete function that can do multiple things include 
        Delete();                           //calling of the delete function
        alert('The List Was Cleared');
        navigation.navigate('HomeScreen');
    }

    const [data, setData] = useState([]);
    useEffect(() => {                                     //for fetching all the rows from the table
        const fetchDatabaseData = async () => {
        const db = SQLite.openDatabase('student.db');       //to open database
        db.transaction(tx => {
            tx.executeSql(
            'SELECT * FROM student',
            [],
            (_, resultSet) => {
                setData(resultSet.rows._array);
            },
            (_, error) => {
                console.error('Error fetching data:', error);
            }
            );
        });
    };

    fetchDatabaseData();
    }, []);

    function Refresh(){
      const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
      db.transaction(tx => {                               //works like refreshing
        tx.executeSql(
        'SELECT * FROM student',
        [],
        (_, resultSet) => {
            setData(resultSet.rows._array);
        },
        (_, error) => {
            console.error('Error fetching data:', error);
        }
        );
    });
    }
    Refresh();
    function DeleteSingle(id) {
      const db = SQLite.openDatabase('student.db');
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM student WHERE id = ?',
          [id],
          (_, result) => {
            console.log("Deleted 1 Student");
          },
        );
      });
      Refresh();             //it calls the refresh function for refreshing and removing deleted element 
    }

    function Phone_half({item}){
      var a=item.phone;
      b=a.slice(0,2);
      c=a.slice(7,10);
      return <Text>{b}***{c}</Text>;
    }
    function Date_half({item}){
      var a=item.created_at;
      b=a.slice(0,10);
      return <Text>{b}</Text>;
    }

    function Mail_half({item}){
      var a=item.email;
      a=a.slice(0,4);
      return <Text>{a}***.com</Text>;
    }

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={{flex:1}}>
        <Image source={{ uri: item.photo }} style={styles.pic} />
      </View>
      <View style={{flex:1,alignItems:'baseline'}}>
        <Text><Text style={{fontWeight:'bold'}}>ROLL:</Text> {item.rollno}</Text>
        <Text><Text style={{fontWeight:'bold'}}>NAME:</Text> {item.name}</Text>
        <Text><Text style={{fontWeight:'bold'}}>PHONE:</Text> {Phone_half({item})}</Text>
        <Text><Text style={{fontWeight:'bold'}}>EMAIL:</Text> {Mail_half({item})}</Text>
        <Text><Text style={{fontWeight:'bold'}}>DATE:</Text> {Date_half({item})}</Text>
      </View>
      <View style={{flex:1/4}}>
        <Pressable style={{alignContent:'flex-start',marginBottom:'50%'}} onPress={()=>{
          Alert.alert('WARNING','Do You Wand To Edit This Item?',  [
            {text: 'Cancel', onPress: () => {}},
            {text: 'Edit', onPress: () => {
              navigation.navigate('Update',{id:item.id});
            }},
          ]);
        }}><MaterialCommunityIcons name='square-edit-outline' size={25} /></Pressable>
        <Pressable style={{alignContent:'flex-start'}} onPress={()=>{
          Alert.alert('WARNING','Are you sure you want to delete this item?',  [
            {text: 'Cancel', onPress: () => {}},
            {text: 'Delete', onPress: () => DeleteSingle(item.id)},
          ]);
        }}><MaterialCommunityIcons name='delete' size={25} /></Pressable>
      </View>
    </View>
  );
  

  return (
    <View style={{flex:1,backgroundColor:'#ac737c'}}>
      <Text style={{alignSelf:'center',fontSize:20}}>LIST OF REGISTERED STUDENTS</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="EMPTY THE LIST" onPress={()=>{
        Alert.alert('WARNING','Are You Sure! This Will Delete Everything',
        [{text:'Delete',onPress:()=>{ClearList()}},{text:'Cancel',onPress:()=>{}}]);
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#dfb266',
    },
    pic:{
        width: 100,
        height: 100, 
        alignSelf:'center',
        margin:10,
        borderWidth:5,
        borderColor: '#ac737c', 
        borderRadius:8,
    }
});
