import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
// import { styles } from "./helper/Styles";
import { useEffect, useState } from "react";
import { Avatar, Divider, Modal, Portal, PaperProvider, TextInput} from 'react-native-paper';

export function TextBox({title}){
    const [text, setText] = useState('');
    const submitted = () => {console.log("AAA")}
    return(
        <TextInput
            onSubmitEditing={submitted}
            onChangeText={text=>setText(text)}
            value={text}
            placeholder={`New ${title}`}
        />
    );
};

export default function EditUser({ route }) {
    const [visible, setVisible] = useState(false);
    const [pressedButton, setPressedButton] = useState([]);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    const MyModal = () =>{
        return(
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                    <Text style={{fontSize:20,flexWrap: 'wrap-reverse',flex:1}}>Enter a new {pressedButton}</Text>
                    <TextBox title={pressedButton}/>
                </Modal>
            </Portal>
        );
    };
    const Pressed = (title) =>{
        showModal();
        setPressedButton(title);
    }
    const SelectionButton = ({title}) => {
        return(
            <Pressable onPress={()=>{Pressed(title)}} style={styles.button}>
                <View style={{display:'flex', flex:1, flexDirection:'row'}}>
                    <Text style={{fontSize:20,alignSelf:'center',marginLeft:17}}>
                        {title}
                    </Text>
                    <Text style={{fontSize:20,alignSelf:'center',marginLeft:'auto',marginRight:17}}>{">"}</Text>
                </View>
            </Pressable>
        );
    };

    return(
        <View style={{display:'flex',flex:1,backgroundColor: "#BBCDE5"}}>
            <PaperProvider>
                <Avatar.Image size={150} source={require('../assets/panda.png')} style={{flex:1, marginTop:50,alignSelf:'center', backgroundColor:"#BBCDE5"}} />
                <MyModal/>
                <View style={{flex:1}}>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Username'}/>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Email'}/>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Description'}/>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Password'}/>
                    <Divider style={styles.divider} />
                </View>

                <View style={{flex:1}}/>
            </PaperProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    divider: {
        height: 1.5,
        marginHorizontal: 17,
        backgroundColor : "#3187D8",
    },
    button: {
        marginLeft:17,
        marginRight:17,
        marginTop:5,
        marginBottom:5,
        flex:1,
        borderRadius:10,
        justifyContent:'flex-start'
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        margin:20
    },
})