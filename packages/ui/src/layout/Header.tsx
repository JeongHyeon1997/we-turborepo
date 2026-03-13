import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppTheme } from '@we/utils';

interface HeaderProps {
  logo: ReactNode;
  icons?: ReactNode;
  theme: AppTheme;
}

export function Header({ logo, icons, theme }: HeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
      <View style={styles.logo}>{logo}</View>
      {icons && <View style={styles.icons}>{icons}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
