import { useState } from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import type { AppTheme } from '@we/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { NavTab } from './BottomNav';

interface StackScreen {
  content: ReactNode;
  title: string;
  onBack: () => void;
}

interface AppLayoutProps {
  logo: ReactNode;
  headerIcons?: ReactNode;
  tabs: NavTab[];
  theme: AppTheme;
  /** 설정 등 스택 화면. 설정되면 탭 대신 이 화면을 표시하고 헤더를 스택 모드로 전환 */
  stackScreen?: StackScreen;
}

export function AppLayout({ logo, headerIcons, tabs, theme, stackScreen }: AppLayoutProps) {
  const [activeKey, setActiveKey] = useState(tabs[0].key);
  const activeTab = tabs.find((t) => t.key === activeKey);
  const activeScreen = activeTab?.screen;
  const activeHeaderIcons = activeTab?.headerIcons ?? headerIcons;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.headerBg }]}>
      <Header
        logo={logo}
        icons={stackScreen ? undefined : activeHeaderIcons}
        theme={theme}
        stackMode={!!stackScreen}
        title={stackScreen?.title}
        onBack={stackScreen?.onBack}
      />
      <View style={[styles.main, { backgroundColor: theme.contentBg }]}>
        {stackScreen ? stackScreen.content : activeScreen}
      </View>
      {!stackScreen && (
        <BottomNav tabs={tabs} activeKey={activeKey} onTabPress={setActiveKey} theme={theme} />
      )}
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
