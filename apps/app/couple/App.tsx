import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { MyButton } from "@we/ui";
import { formatCurrency } from "@we/utils";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Couple App 💑</Text>
      <Text style={styles.subtitle}>
        Spend together: {formatCurrency(50000)}
      </Text>
      
      <MyButton 
        title="Check Couple Plan" 
        onPress={() => Alert.alert("Couple action!")} 
        style={styles.button}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f6", // Light pink for couple app
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d6336c",
  },
  subtitle: {
    fontSize: 16,
    color: "#868e96",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: "#d6336c",
  }
});
