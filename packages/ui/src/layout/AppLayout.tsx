import { useState } from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import type { AppTheme } from '@we/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { NavTab } from './BottomNav';

interface AppLayoutProps {
  logo: ReactNode;
  headerIcons?: ReactNode;
  tabs: NavTab[];
  theme: AppTheme;
}

export function AppLayout({ logo, headerIcons, tabs, theme }: AppLayoutProps) {
  const [activeKey, setActiveKey] = useState(tabs[0].key);
  const activeTab = tabs.find((t) => t.key === activeKey);
  const activeScreen = activeTab?.screen;
  const activeHeaderIcons = activeTab?.headerIcons ?? headerIcons;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.headerBg }]}>
      <Header logo={logo} icons={activeHeaderIcons} theme={theme} />
      <View style={[styles.main, { backgroundColor: theme.contentBg }]}>
        {activeScreen}
      </View>
      <BottomNav tabs={tabs} activeKey={activeKey} onTabPress={setActiveKey} theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
});
