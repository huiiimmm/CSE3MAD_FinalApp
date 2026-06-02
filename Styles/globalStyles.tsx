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
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 15,
      width: "100%",
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card || "#f5f5f5",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      borderLeftWidth: 4,
    },
    cardLabel: {
      fontSize: 12,
      color: "gray",
      fontWeight: "600",
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    dataCard: {
      backgroundColor: theme.card || "#fff",
      padding: 16,
      borderRadius: 10,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: theme.border || "#e0e0e0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      paddingBottom: 4,
    },
    stretchTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4A90E2",
      textTransform: "capitalize",
    },
    gridRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    metaLabel: {
      fontSize: 11,
      color: "gray",
    },
    metaValue: {
      fontSize: 14,
      fontWeight: "600",
    },
    attribution: {
      fontSize: 10,
      color: "darkgray",
      marginTop: 8,
      fontStyle: "italic",
    },
  });
