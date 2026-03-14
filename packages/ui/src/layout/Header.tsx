import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { AppTheme } from '@we/utils';

interface HeaderProps {
  logo: ReactNode;
  icons?: ReactNode;
  theme: AppTheme;
  stackMode?: boolean;
  title?: string;
  onBack?: () => void;
}

export function Header({ logo, icons, theme, stackMode, title, onBack }: HeaderProps) {
  if (stackMode) {
    return (
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
          <Text style={[styles.backArrow, { color: theme.navInactiveColor }]}>‹</Text>
        </Pressable>
        <Text style={[styles.stackTitle, { color: theme.navActiveColor }]}>{title}</Text>
        <View style={styles.backBtn} />
      </View>
    );
  }

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
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
  stackTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
});
