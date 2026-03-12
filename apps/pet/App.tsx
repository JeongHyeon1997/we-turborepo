import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { MyButton } from "@we/ui";
import { formatCurrency } from "@we/utils";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet App 🐾</Text>
      <Text style={styles.subtitle}>
        Pet food cost: {formatCurrency(35000)}
      </Text>
      
      <MyButton 
        title="Feed Pet" 
        onPress={() => Alert.alert("Pet action!")} 
        style={styles.button}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9db", // Light yellow for pet app
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#f59f00",
  },
  subtitle: {
    fontSize: 16,
    color: "#868e96",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#f59f00",
  }
});
