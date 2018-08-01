import React from "react";
import {View, Text, Dimensions, StyleSheet} from "react-native";

const {width} = Dimensions.get("window");

function OfflineBar() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: "#b52424",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width
    },
    offlineText: { color: "#fff" }
});

export default OfflineBar;