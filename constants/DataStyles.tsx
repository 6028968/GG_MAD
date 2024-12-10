import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";

const { width } = Dimensions.get("window");
const margin = 5; 
const itemWidth = (width / 5) - (margin * 3);

export const dataStyles = StyleSheet.create({
    uitklapbaarMenu:
    { 
        marginHorizontal: 10, 
        marginBottom: 10, 
        // paddingTop: 10, 
        paddingBottom: 25, 
        gap: 0, 
        marginTop: 10,
    },
    uitklapMenuTitle:
    { 
        fontSize: 20, 
        color: "white", 
        fontWeight: "bold", 
        marginRight: 10 
    },
    containerTitle:
    { 
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
    },
    parentFlatlistContainer:
    {
        flexDirection: "row", 
        flex: 1, 
        backgroundColor: "rgba(221, 245, 222, 0.5)"
        // backgroundColor: "red",
    },
    binnenContainerParent:
    {
        paddingVertical: 5, 
        paddingHorizontal: 15, 
    },
    binnenContainer:
    { 
        // backgroundColor: "rgba(221, 245, 222, 0.5)"
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
        gap: 1, 
        paddingBottom: 10
    },
    binnenContainerFlatlist:
    { 
        // backgroundColor: "white" 
        maxHeight: 250,
    },
    innerTitle:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#353535"
    },
    innerItem:
    {
        flexDirection: "row",
        gap: 5,
    },
    eersteTekst:
    {
        fontSize: 20,
        color: "darkgray",
    },
    tweedeTekst:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#9C9C9C",
    },
    triangleUp: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: Colors.light.text, 
    },
    triangleDown: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderTopWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: Colors.light.text,
    },
    subTitleMenu:
    { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#ABD3AE", 
        justifyContent: "space-between", 
        paddingHorizontal: 10, 
        paddingVertical: 8, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, 
        marginTop: 20 
    },
    scrollbarTrack: {
        width: 12,
        height: 250,
        marginHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 15,
        position: "relative",
        borderColor: Colors.light.primary,
        borderWidth: 2,
        margin: 10,
    },
    scrollbarThumb: {
        width: 8,
        height: 46,
        backgroundColor: Colors.light.text,
        borderRadius: 15,
        position: "absolute",
    },
    
    
});const styles = StyleSheet.create({
    uitklapbaarMenu:
    { 
        marginHorizontal: 10, 
        marginBottom: 15, 
        // paddingTop: 10, 
        paddingBottom: 25, 
        gap: 0, 
        marginTop: 40,
    },
    uitklapMenuTitle:
    { 
        fontSize: 20, 
        color: "white", 
        fontWeight: "bold", 
        marginRight: 10 
    },
    containerTitle:
    { 
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
    },
    parentFlatlistContainer:
    {
        flexDirection: "row", 
        flex: 1, 
        backgroundColor: "rgba(221, 245, 222, 0.5)"
        // backgroundColor: "red",
    },
    binnenContainerParent:
    {
        paddingVertical: 5, 
        paddingHorizontal: 15, 
    },
    binnenContainer:
    { 
        // backgroundColor: "rgba(221, 245, 222, 0.5)"
        borderBottomWidth: 3, 
        borderColor: Colors.light.primary, 
        gap: 1, 
        paddingBottom: 10
    },
    binnenContainerFlatlist:
    { 
        // backgroundColor: "white" 
        maxHeight: 250,
    },
    innerTitle:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#353535"
    },
    innerItem:
    {
        flexDirection: "row",
        gap: 5,
    },
    eersteTekst:
    {
        fontSize: 20,
        color: "darkgray",
    },
    tweedeTekst:
    {
        fontWeight: "bold",
        fontSize: 20,
        color: "#9C9C9C",
    },
    triangleUp: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: Colors.light.text, 
    },
    triangleDown: 
    {
        width: 0,
        height: 0,
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderTopWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: Colors.light.text,
    },
    subTitleMenu:
    { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#ABD3AE", 
        justifyContent: "space-between", 
        paddingHorizontal: 10, 
        paddingVertical: 8, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, 
        marginTop: 20 
    },
    scrollbarTrack: {
        width: 12,
        height: 250,
        marginHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 15,
        position: "relative",
        borderColor: Colors.light.primary,
        borderWidth: 2,
        margin: 10,
    },
    scrollbarThumb: {
        width: 8,
        height: 46,
        backgroundColor: Colors.light.text,
        borderRadius: 15,
        position: "absolute",
    },
    
    
});