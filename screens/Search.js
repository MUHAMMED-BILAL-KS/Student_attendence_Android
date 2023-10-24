import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet,Button, Pressable,Alert,TextInput } from 'react-native';
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

  const CreateTable = async () => {                   //function for creating a new table
    const db = await initializeDatabase();
  
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS temp(id REFERENCES student (id), created_at DATETIME)",
        [],
        (_, result) => {
          console.log('Temporary Table created:', result);
        },
        (_, error) => {
          console.error('Error creating Temporary table:', error);
        }
      );
    });
  };


    const [data, setData] = useState([]);
    useEffect(() => {                                     //for fetching all the rows from the table
        const fetchDatabaseData = async () => {
        const db = SQLite.openDatabase('student.db');       //to open database
        db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM student WHERE strftime('%Y-%m-%d', created_at) =  ?  ;",
              [date],
            (_, resultSet) => {
                setData(resultSet.rows._array);
            },
            (_, error) => {
                console.error('Error fetching data:', error);
            }
            );
        });
    };
    CreateTable();

    fetchDatabaseData();
    }, []);

    function Refresh(){
      const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
      db.transaction(tx => {                               //works like refreshing
        tx.executeSql(
          "SELECT * FROM student WHERE strftime('%Y-%m-%d', created_at) =  ?  ;",
          [date],
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

    const validateDate = (date) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(date);
    };

    //to get current date and display it in the search field as default
    const getCurrentDate=()=>{
 
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      return year + '-' + month + '-' + date;//format: yyyy-mm-dd;
    }
    const currentdate = getCurrentDate()
    const [date,Setdate]=useState(currentdate);

    function Search(date){
      const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
      db.transaction(tx => {                               //works like refreshing
        tx.executeSql(
        "SELECT * FROM student WHERE strftime('%Y-%m-%d', created_at) =  ?  ;",
        [date],
        (_, resultSet) => {
          console.log('Search Found');
        },
        (_, error) => {
            console.error('Error fetching data:', error);
        }
        );
    });
    }
    
  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={{flex:1}}>
        <Image source={{ uri: item.photo }} style={styles.pic} />
      </View>
      <View style={{flex:1,alignItems:'baseline'}}>
        <Text><Text style={{fontWeight:'bold'}}>ID:</Text> {item.id}</Text>
        <Text><Text style={{fontWeight:'bold'}}>NAME:</Text> {item.name}</Text>
        <Text><Text style={{fontWeight:'bold'}}>PHONE:</Text> {item.phone}</Text>
        <Text><Text style={{fontWeight:'bold'}}>DATE:</Text> {item.created_at}</Text>
        <Text><Text style={{fontWeight:'bold'}}>STATUS:</Text> {item.status}</Text>
      </View>
      <View style={{flex:1/4}}>
        <Pressable style={{alignContent:'flex-start',marginBottom:'50%'}} onPress={()=>{

          }
        }><MaterialCommunityIcons name='square-edit-outline' size={25} /></Pressable>
        <Pressable style={{alignContent:'flex-start'}} onPress={()=>{
          
          }
        }><MaterialCommunityIcons name='delete' size={25} /></Pressable>
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

      <View style={{height:"10%",flexDirection:'row'}}>
        <TextInput style={{flex:4,backgroundColor:"white",fontSize:15,textAlign:'center'}}
          placeholder="Enter Date In Format YYYY-MM-DD"
          keyboardType='name-phone-pad'
          onChangeText={(date) => {
            // Validate the user input
            Setdate(date);
            if (!validateDate(date)) {
              // Show an error message
            }
          }}
        /><Button style={{flex:1,justifyContent: 'center'}} title="search" onPress={()=>{
          Search(date);
        }} />
      </View>

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
