import { StyleSheet } from "react-native";

const colors = {
    primary: '#3187D8',
    background: '#F3F6F7',
    white: "#FFFBFA",
    good: '#B1E59F',
    okay: '#FFEFB4',
    bad: '#E59F9F',
    text: '#00120B',
    border: '#00120B',
};

export const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        justifyContent: "center",
    },
    textInput: {
        padding: 10,
        borderBottomColor: "#colors.primary",
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 10,
    },
    reviewInput: {
        border: "black",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 25,
        flex: 2,
        padding: 15,
        alignContent: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
    },
    buttonContainer: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
        color: '#colors.primary',
    },
    enterButton: {
        color: '#colors.primary',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    songResultContainer: {
        flex: 1,
        padding: 20,
        margin: 10,
        marginRight: "4rem",
        marginLeft: "4rem",
        borderRadius: 15,
        flexDirection: "row",
        border: "black",
        borderWidth: StyleSheet.hairlineWidth,
    },
    songValueContainer: {
        flexDirection: "column",
        gap: 5,
    },
    flatListContainer: {
        flex: 2,
    },
    ModalContainer: {
        height: "35%",
        width: "70%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 15,
    },
    ModalInformationContainer: {
        flex: 3,
        padding: 10,
    },
    SongInformationContainer: {
        alignItems: "flex-start",
        padding: 10,
        flex: 1,
    },
    RatingInformationContainer: {
        padding: 25,
        alignItems: "center",
        flex: 2,
    },
    ModalRatingContainer: {
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-around",
        flex: 1,
    },
    GoodButton: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: colors.good,
        borderRadius: 50,
        height: 80,
        width: 80,
    },
    OkayButton: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: colors.okay,
        height: 80,
        width: 80,
        borderRadius: 80,
    },
    BadButton: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: colors.bad,
        borderRadius: 50,
        height: 80,
        width: 80,
    },
    OuterView: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    titleContainer: {
        paddingTop: 20,
        flex: 0.6,
        alignItems: "left",
        justifyContent: "left",
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 4,
        backgroundColor: colors.background,
    },
    card: {
        margin: 6,
        backgroundColor: colors.white,
    },
    chip: {
        margin: 4,
    },
    preference: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 0,
        paddingHorizontal: 8,
    },
    button: {
        borderRadius: 12,
        backgroundColor: colors.primary,
    },
    customCardRadius: {
        borderTopLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    customCoverRadius: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 24,
    },
    
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        margin: 8,
    },
    avatar: {
    },
    searchbar: {
        margin: 4,
        backgroundColor: colors.white,
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 8,
        zIndex: 1,
    },
    circleBackground: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 5,
    },
    divider: {
        height: 1.5,
        marginTop: 17,
        marginHorizontal: 17,
        backgroundColor : "#3187D8" 
    }
});