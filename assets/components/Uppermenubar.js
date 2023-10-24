import { Button, Image,Pressable,RefreshControl,ScrollView,StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Menu() {
    return (
        <View style={styles.menu}>
          <View style={{flex:1 }}>
            <MaterialCommunityIcons
                name="face-recognition"
                size={35}
                color="#515BD4"
                style={{alignSelf:'center'}}
            />
          </View>
          <View style={{flex:6}}>
            <Text style={styles.text_center}>FACE RECOGNITION</Text>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menu : {
        alignItems:'center',
        flexDirection:'row',
        height:'8%',
        backgroundColor:'#ff9',
      },
    text_center: {
        textAlign:'center',
        fontSize: 27,
        fontWeight : "bold",
        color:'#101820',
        fontStyle:'italic',
        fontFamily:'',
        backgroundColor:'#ff9'
      },
});



