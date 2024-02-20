import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#FFFBFA",
        padding: 30,
    },
    searchContainer: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    textInput: {
        padding: 10,
        borderBottomColor: "black",
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
    },
    enterButton: {
        color: '#3187D8',
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
        backgroundColor: "#B1E59F",
        borderRadius: 50,
        height: 80,
        width: 80,
    },
    OkayButton: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "#FFEFB4",
        height: 80,
        width: 80,
        borderRadius: 80,
    },
    BadButton: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "#E59F9F",
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
        flex: 0.6,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        // marginTop: 16,
        // paddingVertical: 8,
        color: '#3187D8',
        textAlign: 'center',
        fontSize: 45,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    enterButton: {
        color: '#3187D8',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
});