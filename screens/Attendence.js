import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { View, Text, FlatList, Image, StyleSheet,Button, Pressable,Alert,TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import {Asset} from "expo-asset";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";


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
        "CREATE TABLE IF NOT EXISTS temp(id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER REFERENCES student(id), created_at DATETIME)",
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
  

    const validateDate = (date) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(date);
    };

    const getCurrentDate=()=>{
 
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      return year + '-' + month + '-' + date;//format: yyyy-mm-dd;
    }

    const currentdate = getCurrentDate()

    const [date,Setdate]=useState(currentdate);

    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    useEffect(() => {                                     //for fetching all the rows from the table
        const fetchDatabaseData = async () => {
        const db = SQLite.openDatabase('student.db');       //to open database
        db.transaction(tx => {
            tx.executeSql(
            "SELECT * FROM student ORDER BY rollno ASC",
            [],
            (_, resultSet) => {
                setData(resultSet.rows._array);
            },
            (_, error) => {
                console.error('Error fetching data:', error);
            }
            );
        });
        db.transaction(tx => {            //for fetching data from temp and store it in data2 using Setdata2
          tx.executeSql(
          "SELECT * FROM temp",                 
          [],
          (_, resultSet) => {
              setData2(resultSet.rows._array);
          },
          (_, error) => {
              console.error('Error fetching data:', error);
          }
          );
      });

        CreateTable();
        
      };
    fetchDatabaseData();
    }, []);

    //to get current date and display it in the search field as default

    function Search(date){
      const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM student ORDER BY rollno ASC;",
        // "SELECT * FROM student WHERE id IN (SELECT nid FROM temp WHERE strftime('%Y-%m-%d', created_at) =  ?);",
        [],
        (_, resultSet) => {
            setData(resultSet.rows._array);
        },
        (_, error) => {
            console.error('Error fetching data:', error);
        }
        );
    });
    Refresh();
    }

    function Status({ item }) {
      let status = 'Absent';
    
      data2.forEach((student) => {
        if (item.id === student.nid && student.created_at === date) {
          status = 'Present';
        }
      });
    
      return <Text>{status}</Text>;
    }    

   function Refresh(){
    const db = SQLite.openDatabase('student.db');       //to open database
        db.transaction(tx => {
            tx.executeSql(
            "SELECT * FROM student ORDER BY rollno ASC",
            [],
            (_, resultSet) => {
                setData(resultSet.rows._array);
            },
            (_, error) => {
                console.error('Error fetching data:', error);
            }
            );
        });
        db.transaction(tx => {
          tx.executeSql(
          "SELECT * FROM temp",
          [],
          (_, resultSet) => {
              setData2(resultSet.rows._array);
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
        <Text><Text style={{fontWeight:'bold'}}>ROLL NO:</Text> {item.rollno}</Text>
        <Text><Text style={{fontWeight:'bold'}}>NAME:</Text> {item.name}</Text>
        <Text><Text style={{fontWeight:'bold'}}>DATE:</Text> {date}</Text>
        <Text><Text style={{fontWeight:'bold'}}>STATUS:</Text> {Status({item})}
        </Text>
      </View>
      <View style={{flex:1/4}}>
        <Pressable style={{alignContent:'flex-start',marginBottom:'50%'}} onPress={
          ()=>{

            const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table

            const sql = `INSERT INTO temp (nid,created_at) VALUES (?,?)`;
            const values = [item.id,date];
            db.transaction((tx) => {
              tx.executeSql(sql, values,
                (_, result) => {
                    console.log("Inserted to temp");
              }, );
            });
            Refresh();
            Status({ item });
          }
        }><Ionicons name='checkmark-circle-sharp' size={25} /></Pressable>
        <Pressable style={{alignContent:'flex-start'}} onPress={
          ()=>{

            const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
            const sql = `DELETE FROM temp WHERE nid = ? AND created_at = ?`;
            const values = [item.id,date];
            db.transaction((tx) => {
              tx.executeSql(sql, values,
                (_, result) => {
                    console.log("DELETED FROM temp");
              }, );
            });
            Refresh();
            Status({ item });
          }
          }><Entypo name='circle-with-cross' size={25} /></Pressable>
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
      {/* <Button title="EMPTY THE LIST" onPress={()=>{
        Alert.alert('WARNING','Are You Sure! This Will Delete Everything',
        [{text:'Delete',onPress:()=>{ClearList()}},{text:'Cancel',onPress:()=>{}}]);
      }} /> */}
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
