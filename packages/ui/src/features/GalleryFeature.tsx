import { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Modal, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DiaryEntry } from '@we/utils';

const N = {
  gray50:'#f9fafb', gray100:'#f3f4f6', gray200:'#e5e7eb',
  gray400:'#9ca3af', gray600:'#4b5563', gray700:'#374151', gray800:'#1f2937',
  white:'#ffffff',
};

const { width } = Dimensions.get('window');
const GAP = 2;
const COL = 3;
const CELL = (width - GAP * (COL + 1)) / COL;

export interface GalleryFeatureProps {
  accentColor: string;
  entries: DiaryEntry[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export function GalleryFeature({ entries }: GalleryFeatureProps) {
  const [selected, setSelected] = useState<DiaryEntry | null>(null);
  const withImages = entries.filter(e => !!e.image);

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
    <View style={{ flex:1, backgroundColor: N.gray50 }}>
      <FlatList
        data={withImages}
        keyExtractor={item => item.id}
        numColumns={COL}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding:GAP, gap:GAP }}
        columnWrapperStyle={{ gap:GAP }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            <Image source={{ uri: item.image! }} style={{ width:CELL, height:CELL }} resizeMode="cover" />
          </Pressable>
        )}
      />

      {selected && (
        <Modal visible animationType="fade" transparent>
          <Pressable style={s.overlay} onPress={() => setSelected(null)}>
            <Pressable style={s.modal} onPress={() => {}}>
              {selected.moodColor && <View style={{ height:5, backgroundColor:selected.moodColor }} />}
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalDate}>{formatDate(selected.createdAt)}</Text>
                  <Text style={s.modalTitle}>{selected.title}</Text>
                </View>
                <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                  <Ionicons name="close" size={22} color={N.gray400} />
                </Pressable>
              </View>
              <Image source={{ uri: selected.image! }} style={s.photoFull} resizeMode="cover" />
              {selected.content ? (
                <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={s.modalContent}>{selected.content}</Text>
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
  empty: { flex:1, alignItems:'center', justifyContent:'center', gap:10, backgroundColor:N.gray50 },
  emptyIcon: { fontSize:52 },
  emptyTitle: { fontSize:17, fontFamily:'BMJUA', color:N.gray700 },
  emptyDesc: { fontSize:13, fontFamily:'BMHANNAPro', color:N.gray400, textAlign:'center', lineHeight:22 },
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' },
  modal: { backgroundColor:N.white, borderRadius:20, width:'92%', maxWidth:400, maxHeight:'85%', overflow:'hidden' },
  modalHeader: { flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', padding:16, paddingBottom:10 },
  modalDate: { fontSize:12, color:N.gray400, fontFamily:'BMHANNAPro', marginBottom:2 },
  modalTitle: { fontSize:16, fontFamily:'BMJUA', color:N.gray800 },
  photoFull: { width:'100%', aspectRatio:4/3 },
  modalBody: { maxHeight:120, paddingHorizontal:16, paddingVertical:12 },
  modalContent: { fontSize:14, fontFamily:'BMHANNAPro', color:N.gray600, lineHeight:22 },
});
