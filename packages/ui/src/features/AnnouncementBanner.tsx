import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AnnouncementBase } from '@we/utils';

const N = {
  gray100: '#f3f4f6', gray400: '#9ca3af', gray800: '#1f2937', white: '#ffffff',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export interface AnnouncementBannerProps {
  announcements: AnnouncementBase[];
  accentColor: string;
  onPress: (id: string) => void;
}

export function AnnouncementBanner({ announcements, accentColor, onPress }: AnnouncementBannerProps) {
  const [idx, setIdx] = useState(0);
  const anim = useRef(new Animated.Value(1)).current;

  // 인덱스 변경 시 슬라이드인 애니메이션
  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [idx]);

  // 자동 재생
  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const ann = announcements[idx];
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });

  return (
    <View style={s.outer}>
      <Pressable style={s.card} onPress={() => onPress(ann.id)}>
        <View style={[s.iconBox, { backgroundColor: accentColor + '28' }]}>
          <Ionicons name="megaphone-outline" size={18} color={accentColor} />
        </View>

        <Animated.View style={[s.body, { opacity: anim, transform: [{ translateY }] }]}>
          {ann.important && (
            <View style={[s.importantTag, { backgroundColor: accentColor + '22' }]}>
              <Text style={[s.importantTagText, { color: accentColor }]}>중요</Text>
            </View>
          )}
          <Text style={s.title} numberOfLines={1}>{ann.title}</Text>
          <Text style={s.date}>{formatDate(ann.createdAt)}</Text>
        </Animated.View>

        <Ionicons name="chevron-forward" size={16} color={N.gray400} />
      </Pressable>
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
    overflow: 'hidden',
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
});
