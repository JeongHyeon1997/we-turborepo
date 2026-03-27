import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petColors } from '@we/utils';
import type { AnnouncementBase } from '@we/utils';
import { announcements } from '../data/announcements';

const ACCENT = '#97A4D9';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  onPress: (ann: AnnouncementBase) => void;
}

function AnnouncementItem({ ann, onPress }: { ann: AnnouncementBase; onPress: () => void }) {
  return (
    <Pressable style={s.item} onPress={onPress}>
      <View style={[s.iconBox, { backgroundColor: ACCENT + '28' }]}>
        <Ionicons name="megaphone-outline" size={20} color={ACCENT} />
      </View>
      <View style={s.body}>
        <View style={s.titleRow}>
          {ann.important && (
            <View style={[s.badge, { backgroundColor: ACCENT + '22' }]}>
              <Text style={[s.badgeText, { color: ACCENT }]}>중요</Text>
            </View>
          )}
          <Text style={s.title} numberOfLines={1}>{ann.title}</Text>
        </View>
        <Text style={s.date}>{formatDate(ann.createdAt)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={petColors.gray400} />
    </Pressable>
  );
}

export function AnnouncementsScreen({ onPress }: Props) {
  return (
    <FlatList
      data={announcements}
      keyExtractor={item => item.id}
      contentContainerStyle={s.list}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      renderItem={({ item }) => (
        <AnnouncementItem ann={item} onPress={() => onPress(item)} />
      )}
    />
  );
}

const s = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: petColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: petColors.gray100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'BMJUA',
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'BMJUA',
    color: petColors.gray800,
  },
  date: {
    fontSize: 12,
    color: petColors.gray400,
  },
});
