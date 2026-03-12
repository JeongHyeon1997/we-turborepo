import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { MyButton } from "@we/ui";
import { formatCurrency } from "@we/utils";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Turborepo</Text>
      <Text style={styles.subtitle}>
        Formatting sample: {formatCurrency(10000)}
      </Text>
      
      <MyButton 
        title="Shared Button" 
        onPress={() => Alert.alert("Hello from shared package!")} 
        style={styles.button}
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    width: "100%",
  }
});
