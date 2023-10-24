import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import {Asset} from "expo-asset";

async function openDatabase() {                          //function used commonly for database connection
  const dbPath = FileSystem.documentDirectory + 'SQLite/';
  
  if (!(await FileSystem.getInfoAsync(dbPath)).exists) {
    await FileSystem.makeDirectoryAsync(dbPath);
  }
  
  const databaseAsset = Asset.fromModule(require('../assets/database/student.db'));
  await databaseAsset.downloadAsync();
  
  return SQLite.openDatabase('student.db');
}
const initializeDatabase = async () => {                //for open the database as db
  const db = await openDatabase();
  return db;
};

export default function App({navigation}) {
  const [name, setName] = useState('');
  const [rollno, setRollno] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const pickImageAsync = async () => {                          //image picker function
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && !result.error) {
      console.log(result.assets[0]);
      setPhoto(result.assets[0].uri);
    } else if (result.error) {
      alert('ImagePicker Error: ' + result.error);
    } else {
      alert('You did not select any image.');
    }
  };


  const CreateTable = async () => {                     //function for creating a new table
    const db = await initializeDatabase();
  
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS student (id INTEGER PRIMARY KEY AUTOINCREMENT,rollno TEXT, email TEXT, name TEXT, phone TEXT,photo BLOB,status BOOLEAN DEFAULT FALSE,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
        [],
        (_, result) => {
          console.log('Table created:', result);
        },
        (_, error) => {
          console.error('Error creating table:', error);
        }
      );
    });
  };

  function insert() {                           //for inserting values to the table
    if (!name|!phone|!photo|!rollno|!email) {
      alert('Please Fill Every Fields');
      return 1;
    }
    else{
      const sql = `INSERT INTO student ( name, rollno, email, phone, photo) VALUES ( ?, ?, ?, ?, ?)`;
      const values = [ name, rollno, email, phone, photo];
      const db = SQLite.openDatabase('student.db');
      db.transaction((tx) => {
        tx.executeSql(sql, values,
          (_, result) => {
              console.log("Inserted");
        }, );
      });
      return 0;
    }
  };

  function InsertList(){                    //its defined for both the creation in one click
    CreateTable();
    const a=insert();
    if(a==0){
      setName('');
      setRollno('');
      setEmail('');
      setPhone('');
      setPhoto(null);
      alert('Insertion Success');
    }
    
  }
  

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={styles.inputField}
        keyboardType='name-phone-pad'
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.inputField}
        keyboardType='number-pad'
        placeholder="Rollnumber"
        value={rollno}
        onChangeText={text => setRollno(text)}
      />
      <TextInput
        style={styles.inputField}
        keyboardType='email-address'
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.inputField}
        keyboardType='number-pad'
        placeholder="Phone"
        value={phone}
        onChangeText={text => setPhone(text)}
      />
      <TouchableOpacity onPress={pickImageAsync}>
        <Text style={styles.imageBtn}>Select Photo</Text>
      </TouchableOpacity>
      <Image source={{ uri: photo }} style={styles.imageField} />
      <Pressable style={styles.btn} onPress={InsertList}>
        <Text style={{textAlign:'center',fontSize:20}}>SAVE</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={()=>navigation.navigate('Root',{screen:'Display'})}>
        <Text style={{textAlign:'center',fontSize:20}}>SHOW</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField:{
    borderWidth:2,
    borderRadius:10,
    borderColor:'#dfb266',
    shadowColor:'red',
    margin:5,
    height:50,
    textAlign:'left',
    fontSize:20,
    paddingLeft:30,
  },
  imageBtn:{
    fontSize:20,
    textAlign:'center',
    marginTop:15,
    backgroundColor:'#dfb266',
    borderColor:'green',
    borderWidth:2,
    borderRadius:10,
  },
  imageField:{
    width: 100, 
    height: 100,
    borderWidth:5,
    margin:20,
    borderRadius:10,
    borderColor:'green'
  },
  btn:{
    marginTop:15,
    backgroundColor:'#dfb266',
    borderColor:'green',
    borderWidth:2,
    borderRadius:10,
  }
});