import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "./helper/Typography";
// import { styles } from "./helper/Styles";
import { useEffect, useState } from "react";
import { Avatar, Divider, Modal, Portal, PaperProvider, TextInput, HelperText, Button} from 'react-native-paper';

export function TextBox({title}){
    const [text, setText] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitted = () => {CallAPI(title,text)};

    const CallAPI = async(title,text) => {
        const user_id = 3
        var response;
        try{
            if(title=='Username'){
                response = await fetch(
                    `http://127.0.0.1:5000/api/update_profile?user_id=${user_id}&uname=${text}`,
                  {method:'PUT'}).then((response) => response.json());
            }
            else if(title=='Description'){
                response = await fetch(
                    `http://127.0.0.1:5000/api/update_profile?user_id=${user_id}&description=${text}`,
                  {method:'PUT'}).then((response) => response.json());
            }
        }
        catch{
            console.log('Error updating user profile');
        }
        
        try{
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
                activeUnderlineColor = "#3187D8"
                style ={{backgroundColor:"#F3F6F7"}}
            />
            {error
                ?<HelperText type="error" visible={error}>
                    {title} is already in use, please enter another one!
                </HelperText>
                :<HelperText type="info" visible={success}>
                    {title} has been changed!
                </HelperText>
            }
            <Button mode="contained" onPress={submitted} style={{margin:10,backgroundColor:"#3187D8"}}>
                Submit
            </Button>
            
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
                    <Text style={{fontSize:20,flexWrap: 'wrap-reverse',flex:1, marginBottom:20}}>Enter a new {pressedButton}</Text>
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
                <Text style={styles.title}>Settings</Text>
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
    title: {
        marginTop: 16,
        paddingVertical: 8,
        color: '#3187D8',
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: "Poppins",
        flex: 1,
      },
})