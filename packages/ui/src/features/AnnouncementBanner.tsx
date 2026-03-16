import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Announcement } from '@we/utils';

const N = {
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray300: '#d1d5db',
  gray400: '#9ca3af', gray800: '#1f2937', white: '#ffffff',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export interface AnnouncementBannerProps {
  announcements: Announcement[];
  accentColor: string;
  onPress: (id: string) => void;
}

export function AnnouncementBanner({ announcements, accentColor, onPress }: AnnouncementBannerProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const ann = announcements[idx];
  const iconBg = accentColor + '28';

  return (
    <View style={s.outer}>
      <Pressable style={s.card} onPress={() => onPress(ann.id)}>
        <View style={[s.iconBox, { backgroundColor: iconBg }]}>
          <Ionicons name="megaphone-outline" size={18} color={accentColor} />
        </View>
        <View style={s.body}>
          {ann.important && (
            <View style={[s.importantTag, { backgroundColor: accentColor + '22' }]}>
              <Text style={[s.importantTagText, { color: accentColor }]}>중요</Text>
            </View>
          )}
          <Text style={s.title} numberOfLines={1}>{ann.title}</Text>
          <Text style={s.date}>{formatDate(ann.createdAt)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={N.gray400} />
      </Pressable>

      {announcements.length > 1 && (
        <View style={s.dots}>
          {announcements.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setIdx(i)}
              style={[
                s.dot,
                { width: i === idx ? 16 : 6, backgroundColor: i === idx ? accentColor : N.gray300 },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: N.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: N.gray100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  importantTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginBottom: 1,
  },
  importantTagText: {
    fontSize: 10,
    fontFamily: 'BMJUA',
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    fontFamily: 'BMJUA',
    color: N.gray800,
  },
  date: {
    fontSize: 11,
    color: N.gray400,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
    paddingBottom: 2,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
