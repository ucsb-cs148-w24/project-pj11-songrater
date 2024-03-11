import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
// import { styles } from "./helper/Styles";
import { useEffect, useState } from "react";
import { Avatar, Divider, Modal, Portal, PaperProvider, TextInput, HelperText} from 'react-native-paper';

export function TextBox({title}){
    const [text, setText] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitted = () => {CallAPI(title,text)};

    const CallAPI = async(title,text) => {
        const user_id = 1
        var uname;
        var description;
        const curr_info = await fetch(
            `http://127.0.0.1:5000/api/get_profile?user_id=${user_id}`
        ).then((curr_info) => curr_info.json())
        
        try{
            uname = curr_info.results[0].username;
            description = curr_info.results[0].description;
        }
        catch{}
        if (description == undefined){
            description=null;
        }
        var response;
        console.log(title);
        if(title=='Username'){
            response = await fetch(
                `http://127.0.0.1:5000/api/update_profile?user_id=${user_id}&uname=${text}&description=${description}`,
              {method:'PUT'}).then((response) => response.json());
        }
        else if(title=='Description'){
            response = await fetch(
                `http://127.0.0.1:5000/api/update_profile?user_id=${user_id}&uname=${uname}&description=${text}`,
              {method:'PUT'}).then((response) => response.json());
        }
        try{
            console.log(response.MESSAGE)
            if (response.MESSAGE!='Successfully updated profile of user'){
                setError(true);
                setSuccess(false);
            }
            else{
                setError(false);
                setSuccess(true);
            }
        }
        catch{};
    };

    return(
        <View>
            <TextInput
                onSubmitEditing={submitted}
                onChangeText={text=>setText(text)}
                value={text}
                placeholder={`New ${title}`}
            />
            {error
                ?<HelperText type="error" visible={error}>
                    Username is already in use, please enter another one!
                </HelperText>
                :<HelperText type="info" visible={success}>
                    Username has been changed!
                </HelperText>
            }
        </View>

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
        <View style={{display:'flex',flex:1,backgroundColor: "#F3F6F7"}}>
            <PaperProvider>
                <Avatar.Image size={150} source={require('../assets/panda.png')} style={{flex:2, marginTop:50,alignSelf:'center', backgroundColor:"#F3F6F7"}} />
                <MyModal/>
                <View style={{flex:1}}>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Username'}/>
                    <Divider style={styles.divider} />
                    <SelectionButton title={'Description'}/>
                    <Divider style={styles.divider} />
                </View>
                <View style={{flex:2}}/>
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