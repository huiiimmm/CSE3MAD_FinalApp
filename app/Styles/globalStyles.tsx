import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  title: {
    color: "white",
    fontSize: 32,
    marginBottom: 20,
  },

  text: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#e28e4a",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "white",
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
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  colContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    color: "#fff",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "cyan",
  },
});
