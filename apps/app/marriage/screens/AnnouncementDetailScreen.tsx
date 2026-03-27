import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { marriageColors } from '@we/utils';
import type { AnnouncementBase } from '@we/utils';

const ACCENT = '#c9a96e';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  announcement: AnnouncementBase;
}

export function AnnouncementDetailScreen({ announcement: ann }: Props) {
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <View style={s.card}>
        <View style={s.header}>
          {ann.important && (
            <View style={[s.badge, { backgroundColor: ACCENT + '22' }]}>
              <Text style={[s.badgeText, { color: ACCENT }]}>중요</Text>
            </View>
          )}
          <Text style={s.title}>{ann.title}</Text>
          <Text style={s.date}>{formatDate(ann.createdAt)}</Text>
        </View>
        <View style={s.divider} />
        <Text style={s.content}>{ann.content}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: marriageColors.gray50 },
  container: { padding: 16 },
  card: {
    backgroundColor: marriageColors.white, borderRadius: 16,
    borderWidth: 1, borderColor: marriageColors.gray100,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, overflow: 'hidden',
  },
  header: { padding: 20, paddingBottom: 16, gap: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: 'BMJUA', fontWeight: '700' },
  title: { fontSize: 18, fontFamily: 'BMJUA', color: marriageColors.gray900, lineHeight: 26 },
  date: { fontSize: 12, color: marriageColors.gray400 },
  divider: { height: 1, backgroundColor: marriageColors.gray100, marginHorizontal: 20 },
  content: {
    padding: 20, paddingTop: 16, fontSize: 14,
    fontFamily: 'BMHANNAPro', color: marriageColors.gray700, lineHeight: 24,
  },
});
