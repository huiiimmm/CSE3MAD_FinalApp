import { StyleSheet } from "react-native";

export const globalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      padding: 20,
      alignItems: "center",
    },

    title: {
      color: theme.text,
      fontSize: 32,
      marginBottom: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    text: {
      color: theme.text,
      fontSize: 18,
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
      textAlign: "center",
    },

    buttonContainer: {
      flexDirection: "column",
      gap: 12,
      width: 200,
      alignItems: "center",
    },

    sUser: {
      alignItems: "center",
      width: 220,
      borderWidth: 1,
      borderColor: "#999",
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#fff",
    },

    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderColor: theme.border,
      borderWidth: 4,
      overflow: "hidden",
    },

    colContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: 20,
    },

    header: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 30,
      marginBottom: 10,
      textAlign: "center",
    },

    highlightRow: {
      backgroundColor: "orange",
      borderRadius: 10,
    },

    bounceContainer: {
      flex: 1,
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 4,
      overflow: "hidden",
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

    calloutContainer: {
      flexWrap: "wrap",
      height: 90,
    },
  });
