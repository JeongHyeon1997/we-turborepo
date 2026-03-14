import { View, Text, StyleSheet } from 'react-native';
import { coupleColors } from '@we/utils';

export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.empty}>설정 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: coupleColors.gray400,
    fontSize: 15,
  },
});
