import { Button, Image,Pressable,RefreshControl,ScrollView,StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Menu({Camerafunction,Emailfunction,DownloadFunction}) {
    return (
        <View style={styles.menu}>
            <View style={{flex:1}}>
                <Pressable onPress={Emailfunction}>
                    <MaterialCommunityIcons
                    name="email-check"
                    size={40}
                    color="#515BD4"
                    style={{alignSelf:'center',}}
                    />
                </Pressable>
            </View>
            <View style={{flex:1,borderWidth:6,borderRadius:100,borderColor:'#9966ff'}}>
                <Pressable accessibilityHint='camera' onPress={Camerafunction}>
                    <FontAwesome
                    name="camera"
                    size={40}
                    color="#101820"
                    style={{alignSelf:'center',}}
                    />
                </Pressable>
            </View>
            <View style={{flex:1}}>
                <Pressable onPress={()=>{
                    alert('You Have Pressed The Download Sheet Button');
                }}>
                    <FontAwesome
                    name="download"
                    size={40}
                    color="#515BD4"
                    style={{alignSelf:'center',}}
                    />
                </Pressable>
            </View>
      </View>
    );
}

const styles = StyleSheet.create({
    menu : {
        height:'12%',
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:'#ff9',
        width:'100%',
        padding:0,
        flexDirection:'row',
      }
});