import { useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, Modal, ScrollView,
  StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { coupleColors } from '@we/utils';
import type { DiaryEntry } from '@we/utils';
import { myDiaryEntries } from '../data/diaryEntries';

const { width } = Dimensions.get('window');
const GAP = 2;
const COL = 3;
const CELL = (width - GAP * (COL + 1)) / COL;

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function GalleryScreen() {
  const [selected, setSelected] = useState<DiaryEntry | null>(null);

  const withImages = myDiaryEntries.filter(e => !!e.image);

  if (withImages.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyIcon}>🖼️</Text>
        <Text style={s.emptyTitle}>아직 사진이 없어요</Text>
        <Text style={s.emptyDesc}>{'일기에 사진을 첨부하면\n여기에 모아볼 수 있어요'}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: coupleColors.gray50 }}>
      <FlatList
        data={withImages}
        keyExtractor={item => item.id}
        numColumns={COL}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: GAP, gap: GAP }}
        columnWrapperStyle={{ gap: GAP }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            <Image
              source={{ uri: item.image! }}
              style={{ width: CELL, height: CELL }}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />

      {selected && (
        <Modal visible animationType="fade" transparent>
          <Pressable style={s.overlay} onPress={() => setSelected(null)}>
            <Pressable style={s.photoModal} onPress={() => {}}>
              {selected.moodColor && (
                <View style={{ height: 5, backgroundColor: selected.moodColor }} />
              )}
              <View style={s.photoHeader}>
                <View>
                  <Text style={s.photoDate}>{formatDate(selected.createdAt)}</Text>
                  <Text style={s.photoTitle}>{selected.title}</Text>
                </View>
                <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                  <Ionicons name="close" size={22} color={coupleColors.gray400} />
                </Pressable>
              </View>
              <Image
                source={{ uri: selected.image! }}
                style={s.photoFull}
                resizeMode="cover"
              />
              {selected.content ? (
                <ScrollView style={s.photoBody} showsVerticalScrollIndicator={false}>
                  <Text style={s.photoContent}>{selected.content}</Text>
                </ScrollView>
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: coupleColors.gray50,
  },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { fontSize: 17, fontFamily: 'BMJUA', color: coupleColors.gray700 },
  emptyDesc: { fontSize: 13, fontFamily: 'BMHANNAPro', color: coupleColors.gray400, textAlign: 'center', lineHeight: 22 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModal: {
    backgroundColor: coupleColors.white,
    borderRadius: 20,
    width: '92%',
    maxWidth: 400,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 10,
  },
  photoDate: { fontSize: 12, color: coupleColors.gray400, fontFamily: 'BMHANNAPro', marginBottom: 2 },
  photoTitle: { fontSize: 16, fontFamily: 'BMJUA', color: coupleColors.gray800 },
  photoFull: { width: '100%', aspectRatio: 4 / 3 },
  photoBody: { maxHeight: 120, paddingHorizontal: 16, paddingVertical: 12 },
  photoContent: { fontSize: 14, fontFamily: 'BMHANNAPro', color: coupleColors.gray600, lineHeight: 22 },
});
