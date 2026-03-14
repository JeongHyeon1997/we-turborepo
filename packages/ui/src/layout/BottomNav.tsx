import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { AppTheme } from '@we/utils';

export interface NavTab {
  key: string;
  label: string;
  icon: ReactNode;
  screen: ReactNode;
  headerIcons?: ReactNode;
}

interface BottomNavProps {
  tabs: NavTab[];
  activeKey: string;
  onTabPress: (key: string) => void;
  theme: AppTheme;
}

export function BottomNav({ tabs, activeKey, onTabPress, theme }: BottomNavProps) {
  return (
    <View style={[styles.nav, { backgroundColor: theme.navBg, borderTopColor: theme.navBorder }]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onTabPress(tab.key)}>
            <View style={styles.icon}>{tab.icon}</View>
            <Text style={[styles.label, { color: isActive ? theme.navActiveColor : theme.navInactiveColor }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  icon: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
  },
});
