import { StatusBar } from 'expo-status-bar';
import { Button, Image,Pressable,FlatList,RefreshControl,ScrollView,StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState,useEffect } from 'react';
import Menu from '../assets/components/menu';
import Disappearing from '../assets/components/disappearing';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import {Asset} from "expo-asset";
// import Python from 'react-native-python';
import { PythonShell } from 'python-shell';



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
CreateTable();

export default function App({navigation}) {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
    useEffect(() => {                                     //for fetching all the rows from the table
        const fetchDatabaseData = async () => {
        const db = SQLite.openDatabase('student.db');       //to open database
        db.transaction(tx => {
            tx.executeSql(
            'SELECT * FROM student ORDER BY rollno ASC',
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
            'SELECT * FROM temp',
            [],
            (_, resultSet) => {
                setData2(resultSet.rows._array);
            },
            (_, error) => {
                console.error('Error fetching data:', error);
            }
            );
        });
    };

    fetchDatabaseData();
    }, []);

    function Status({ item }) {
      let status = 'Absent';
    
      data2.forEach((temp) => {
        
        if (item.id === temp.nid && temp.created_at === currentdate) {
          status = 'Present';
        }
      });
      return <Text>{status}</Text>;
    } 

  const renderItem=({item})=>(
    <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff9'}}>
        <Text style={styles.ListRow}>{item.rollno}</Text>
        <Text style={styles.ListRow}>{item.name}</Text>
        <Text style={styles.ListRow}>{Status({item})}</Text>
    </View>
  );
  
  const [text,settext]=useState('\n(refresh to sort by date)');
  const [refreshtime,setRefreshtime]=useState(0);

  function Emailfunction(){
    const sender = 'BilalProjectTesting@gmail.com';
    const recipient = 'Muhammedbilal367@gmail.com';
    const subject = 'Test email';
    const body = 'This is a test email.';
    // Python.call('send_email', sender, recipient, subject, body);
    let options={
      scriptPath:""
    }
    PythonShell.run("send_email.py",options,(err,res)=>{
      console.log(err);
      console.log(res);
    })
  };

  
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
      <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={()=>{
        if(refreshtime==0){                               //this condition is for refreshing the first time
          setRefreshtime(1);
          settext('\n(refresh to sort by rollno)');                          //this will work when refreshing
            const fetchDatabaseData = async () => {
              const db = SQLite.openDatabase('student.db');       //to open database
              db.transaction(tx => {
                  tx.executeSql(
                  'SELECT * FROM student ORDER BY created_at ASC',
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
                'SELECT * FROM temp',
                [],
                (_, resultSet) => {
                    setData2(resultSet.rows._array);
                },
                (_, error) => {
                    console.error('Error fetching data:', error);
                }
                );
            });
          };
          fetchDatabaseData();
        }

        else{                                   //this condition is for refreshing second time
          setRefreshtime(0);
            settext('\n(refresh to sort by date)');                          //this will work when refreshing
            const fetchDatabaseData = async () => {
              const db = SQLite.openDatabase('student.db');       //to open database
              db.transaction(tx => {
                  tx.executeSql(
                  'SELECT * FROM student ORDER BY rollno ASC',
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
                'SELECT * FROM temp',
                [],
                (_, resultSet) => {
                    setData2(resultSet.rows._array);
                },
                (_, error) => {
                    console.error('Error fetching data:', error);
                }
                );
            });
          };
          fetchDatabaseData();
      }
        
    }} style={{flex:1}}
    />}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.image} source={require("../assets/images/face_recognition.gif")} />
          </View>
          <View style={{backgroundColor:'#ac737c'}}>
            <View style={{flexDirection:'row',alignSelf:'center',marginBottom:8}}>
              <Pressable style={styles.btn} onPress={()=>navigation.navigate('Root',{screen:'Attendence'})}>
                <Text style={{fontSize:16,textAlign:'center',padding:5}}>ATTENDENCE</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={()=>navigation.navigate('Root',{screen:'Search'})}>
                <Text style={{fontSize:16,textAlign:'center',padding:5}}>SEARCH</Text>
              </Pressable>
            </View>
            <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold'}}>
              STUDENTS LIST<Disappearing text={text} />
            </Text>
            <View  style={{flexDirection:'row',backgroundColor:'white',marginTop:2,marginBottom:2}}>
              <Text style={[styles.ListRow,styles.ListHead]}>ROLLNO</Text>
              <Text style={[styles.ListRow,styles.ListHead]}>NAME</Text>
              <Text style={[styles.ListRow,styles.ListHead]}>STATUS</Text>
            </View>
            <View>
              <FlatList data={data} scrollEnabled={false} renderItem={renderItem} keyExtractor={item => item.id} />
            </View>
            <View style={{flexDirection:'row',alignSelf:'center',marginBottom:8}}>
              <Pressable style={styles.btn} onPress={()=>navigation.navigate('Root',{screen:'Screen2'})}>
                <Text style={{fontSize:16,textAlign:'center',padding:5}}>INSERT</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={()=>navigation.navigate('Root',{screen:'Display'})}>
                <Text style={{fontSize:16,textAlign:'center',padding:5}}>MODIFY</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={Emailfunction}>
                <Text style={{fontSize:16,textAlign:'center',padding:5}}>MAIL</Text>
              </Pressable>
            </View>
          </View>
      </ScrollView>
      <Menu Camerafunction={()=>{
        alert('This Feature Is Under Maintanance');
        // navigation.navigate('FaceRecognition')
          }
        } Emailfunction={()=>{alert('under maintanance')}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9a8d77',
    alignItems:'center'
  },
  image:{
    height:300,
    width:400,
    borderWidth:8,
    borderColor:'#FD1D1D',
    borderRadius:10,
  },
  btn:{
    flex:1,
    alignSelf:'center',
    width:'auto',
    marginTop:5,
    backgroundColor:'#dfb266',
    borderColor:'green',
    borderWidth:2,
    borderRadius:10,
  },
  ListRow:{
    flex:1,
    textAlign:'center',
    borderBottomWidth:1,
    fontSize:15,
  },
  ListHead:{
    fontSize:18,
    fontWeight:'bold',
  }
});
