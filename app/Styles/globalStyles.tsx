import { StyleSheet } from "react-native";

export const globalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      color: theme.background,
    },

    title: {
      color: theme.text,
      fontSize: 32,
      marginBottom: 20,
    },

    text: {
      color: theme.text,
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },

    button: {
      backgroundColor: theme.button,
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 10,
      marginTop: 20,
    },

    buttonText: {
      color: theme.text,
      fontSize: 18,
    },
    buttonContainer: {
      flexDirection: "column",
      gap: 12,
      width: 220,
    },

    sUser: {
      width: 220,
      borderWidth: 1,
      borderColor: "#999",
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#fff",
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      gap: 20,
    },

    colContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      marginTop: 20,
      color: theme.background,
    },
    header: {
      flex: 1,
      justifyContent: "center",
      padding: 40,
      marginTop: 30,
    },
    ball: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "cyan",
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });
