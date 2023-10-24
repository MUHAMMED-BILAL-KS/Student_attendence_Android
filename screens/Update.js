import React, { useState,useEffect } from 'react';
import { useParams } from '@react-navigation/native-stack';
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


export default function App({route,navigation}) {

  const { id } = route.params;

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
  
  const [data,Setdata]=useState({ id: '', name: '', rollno: '', email: '', phone: '', photo: 'https://via.placeholder.com/150' });
           //here given a default address for photo because image source doesnt work with empty

  function Fetch(id){
    const db = SQLite.openDatabase('student.db');        //for fetching all the rows from the table
    db.transaction(tx => {                               //works like refreshing
      tx.executeSql(
      'SELECT * FROM student WHERE id= ?',
      [id],
      (_, resultSet) => {
        const a=resultSet.rows.item(0);
          Setdata(a);
      },
      (_, error) => {
          console.error('Error fetching data:', error);
      }
      );
  });
  }
  
  useEffect(() => {
    Fetch(id);
  }, []);
  
  
  const [name, setName] = useState(data.name);
  const [rollno, setRollno] = useState(data.rollno);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [photo, setPhoto] = useState(data.photo);

  useEffect(() => {
    setName(data.name);
    setRollno(data.rollno);
    setEmail(data.email);
    setPhone(data.phone);
    setPhoto(data.photo);
  }, [data]);

  function Update() {                           //for updating values to the table
    if (!name|!phone|!photo|!rollno|!email) {
      alert('Please Fill Every Fields');
      return 1;
    }
    else{
      const sql = 'UPDATE student SET name = ?, rollno = ?, email = ?, phone = ?, photo=? WHERE id = ?';
      const values = [ name, rollno, email, phone, photo,id];
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

  function UpdateList(){
    Update();
    alert('Updation Successful');
    navigation.navigate('Root',{screen:'Display'});
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
      <Pressable style={styles.btn} onPress={UpdateList}>
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