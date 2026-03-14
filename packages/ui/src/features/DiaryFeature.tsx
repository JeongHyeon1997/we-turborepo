import { useState } from 'react';
import {
  View, Text, FlatList, Pressable, Modal, TextInput, Image,
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { DiaryEntry, Mood } from '@we/utils';

// ─── 뉴트럴 컬러 ─────────────────────────────────────────────────────────────
const N = {
  gray50:'#f9fafb', gray100:'#f3f4f6', gray200:'#e5e7eb', gray300:'#d1d5db',
  gray400:'#9ca3af', gray500:'#6b7280', gray600:'#4b5563', gray700:'#374151',
  gray800:'#1f2937', white:'#ffffff',
};

// ─── 타입 ─────────────────────────────────────────────────────────────────────
interface CreateForm { mood: Mood; title: string; content: string; image: string | null; }
type ViewMode = 'list' | 'calendar';

export interface DiaryFeatureProps {
  accentColor: string;
  moods: readonly Mood[];
  moodModalTitle: string;
  entries: DiaryEntry[];
  onAddEntry: (entry: DiaryEntry) => void;
}

// ─── 달력 헬퍼 ────────────────────────────────────────────────────────────────
const WEEK_DAYS   = ['일','월','화','수','목','금','토'];
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function buildEntryMap(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
  const map: Record<string, DiaryEntry[]> = {};
  for (const e of entries) {
    const key = e.createdAt.slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }
  return map;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

// ─── DiaryCard ────────────────────────────────────────────────────────────────
function DiaryCard({ entry, onPress }: { entry: DiaryEntry; onPress: () => void }) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      {entry.moodColor && <View style={[s.moodStrip, { backgroundColor: entry.moodColor }]} />}
      <View style={s.cardBody}>
        <View style={s.cardMeta}>
          <Text style={s.dateText}>{formatDate(entry.createdAt)}</Text>
          {entry.mood && (
            <View style={[s.moodBadge, { backgroundColor: (entry.moodColor ?? '#ccc') + '33' }]}>
              <Text style={s.moodEmoji}>{entry.mood}</Text>
              {entry.moodLabel && <Text style={[s.moodBadgeLabel, { color: entry.moodColor ?? N.gray600 }]}>{entry.moodLabel}</Text>}
            </View>
          )}
        </View>
        <Text style={s.entryTitle}>{entry.title}</Text>
        <Text style={s.entryContent} numberOfLines={3}>{entry.content}</Text>
        {entry.image && <Image source={{ uri: entry.image }} style={s.entryImage} resizeMode="cover" />}
      </View>
    </Pressable>
  );
}

// ─── DiaryFeature ─────────────────────────────────────────────────────────────
export function DiaryFeature({ accentColor, moods, moodModalTitle, entries, onAddEntry }: DiaryFeatureProps) {
  const today = new Date();
  const [viewMode,      setViewMode]      = useState<ViewMode>('list');
  const [calYear,       setCalYear]       = useState(today.getFullYear());
  const [calMonth,      setCalMonth]      = useState(today.getMonth());
  const [selectedDay,   setSelectedDay]   = useState<number | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [createForm,    setCreateForm]    = useState<CreateForm | null>(null);
  const [detailEntry,   setDetailEntry]   = useState<DiaryEntry | null>(null);

  const entryMap = buildEntryMap(entries);
  const calDays  = getCalendarDays(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); } else setCalMonth(m => m+1);
    setSelectedDay(null);
  }

  function selectMood(mood: Mood) {
    setShowMoodModal(false);
    setCreateForm({ mood, title: '', content: '', image: null });
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setCreateForm(prev => prev ? { ...prev, image: result.assets[0].uri } : prev);
    }
  }

  function submitDiary() {
    if (!createForm) return;
    if (!createForm.title.trim() || !createForm.content.trim()) { Alert.alert('알림', '제목과 내용을 입력해주세요.'); return; }
    onAddEntry({
      id: Date.now().toString(),
      title: createForm.title.trim(),
      content: createForm.content.trim(),
      mood: createForm.mood.emoji,
      moodLabel: createForm.mood.label,
      moodColor: createForm.mood.color,
      image: createForm.image,
      createdAt: new Date().toISOString(),
    });
    setCreateForm(null);
  }

  const selectedDayKey  = selectedDay != null ? `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` : null;
  const selectedEntries = selectedDayKey ? (entryMap[selectedDayKey] ?? []) : [];

  const ViewToggle = (
    <View style={s.toggleWrap}>
      <View style={s.toggleRow}>
        {(['list','calendar'] as const).map(m => (
          <Pressable key={m} style={[s.toggleBtn, viewMode === m && { backgroundColor: accentColor }]} onPress={() => setViewMode(m)}>
            <Ionicons name={m === 'list' ? 'list-outline' : 'calendar-outline'} size={17} color={viewMode === m ? '#fff' : N.gray400} />
            <Text style={[s.toggleText, viewMode === m && { color: N.white }]}>{m === 'list' ? '목록' : '캘린더'}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      {viewMode === 'list' ? (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          style={s.fill}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ViewToggle}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <DiaryCard entry={item} onPress={() => setDetailEntry(item)} />}
        />
      ) : (
        <View style={s.fill}>
          {ViewToggle}
          <View style={s.calMonthNav}>
            <Pressable onPress={prevMonth} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={N.gray600} />
            </Pressable>
            <Text style={s.calMonthTitle}>{calYear}년 {MONTH_NAMES[calMonth]}</Text>
            <Pressable onPress={nextMonth} hitSlop={12}>
              <Ionicons name="chevron-forward" size={24} color={N.gray600} />
            </Pressable>
          </View>
          <View style={s.calCard}>
            <View style={s.calWeekRow}>
              {WEEK_DAYS.map((d, i) => (
                <View key={d} style={s.calCell}>
                  <Text style={[s.calWeekDay, i===0&&{color:'#ef4444'}, i===6&&{color:'#3b82f6'}]}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={s.calGrid}>
              {calDays.map((day, i) => {
                if (!day) return <View key={`e${i}`} style={s.calCell} />;
                const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const dayEntries = entryMap[key] ?? [];
                const isToday    = calYear===today.getFullYear() && calMonth===today.getMonth() && day===today.getDate();
                const isSelected = selectedDay === day;
                const col = i % 7;
                return (
                  <Pressable key={day} style={s.calCell} onPress={() => setSelectedDay(isSelected ? null : day)}>
                    <View style={[s.calDayCircle, isSelected&&{backgroundColor:accentColor}, isToday&&!isSelected&&{borderWidth:2, borderColor:accentColor}]}>
                      <Text style={[s.calDayText, col===0&&{color:'#ef4444'}, col===6&&{color:'#3b82f6'}, isSelected&&{color:'#fff'}]}>{day}</Text>
                    </View>
                    {dayEntries.length > 0 && (
                      <View style={s.dotsRow}>
                        {dayEntries.slice(0,3).map((e,j) => <View key={j} style={[s.dot, {backgroundColor: e.moodColor ?? N.gray300}]} />)}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
          <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding:16, paddingBottom:24 }}>
            {selectedDay != null ? (
              <View>
                <Text style={s.selectedDayTitle}>{calMonth+1}월 {selectedDay}일</Text>
                {selectedEntries.length === 0
                  ? <Text style={s.selectedDayEmpty}>이 날의 일기가 없어요</Text>
                  : <View style={{ gap:12 }}>{selectedEntries.map(e => <DiaryCard key={e.id} entry={e} onPress={() => setDetailEntry(e)} />)}</View>}
              </View>
            ) : <Text style={s.selectedDayEmpty}>날짜를 선택하면 일기를 볼 수 있어요</Text>}
          </ScrollView>
        </View>
      )}

      {/* FAB */}
      <Pressable style={[s.fab, { backgroundColor: accentColor }]} onPress={() => setShowMoodModal(true)}>
        <Ionicons name="add" size={28} color={N.white} />
      </Pressable>

      {/* 상세 모달 */}
      {detailEntry && (
        <Modal visible animationType="fade" transparent>
          <Pressable style={s.overlay} onPress={() => setDetailEntry(null)}>
            <Pressable style={s.detailModal} onPress={() => {}}>
              {detailEntry.moodColor && <View style={{ height:6, backgroundColor:detailEntry.moodColor }} />}
              <View style={s.detailHeader}>
                <Text style={s.detailDate}>{formatDate(detailEntry.createdAt)}</Text>
                <View style={s.detailHeaderRight}>
                  {detailEntry.mood && (
                    <View style={[s.moodBadge, { backgroundColor: (detailEntry.moodColor ?? '#ccc') + '33' }]}>
                      <Text style={s.moodEmoji}>{detailEntry.mood}</Text>
                      {detailEntry.moodLabel && <Text style={[s.moodBadgeLabel, { color: detailEntry.moodColor ?? N.gray600 }]}>{detailEntry.moodLabel}</Text>}
                    </View>
                  )}
                  <Pressable onPress={() => setDetailEntry(null)} hitSlop={8}>
                    <Ionicons name="close" size={22} color={N.gray400} />
                  </Pressable>
                </View>
              </View>
              <ScrollView style={s.detailBody} showsVerticalScrollIndicator={false}>
                <Text style={s.detailTitle}>{detailEntry.title}</Text>
                <View style={s.divider} />
                <Text style={s.detailContent}>{detailEntry.content}</Text>
                {detailEntry.image && <Image source={{ uri: detailEntry.image }} style={s.detailImage} resizeMode="cover" />}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* 기분 모달 */}
      <Modal visible={showMoodModal} transparent animationType="fade">
        <Pressable style={s.overlay} onPress={() => setShowMoodModal(false)}>
          <Pressable style={s.moodModal} onPress={() => {}}>
            <Text style={s.moodModalTitle}>{moodModalTitle}</Text>
            <View style={s.moodGrid}>
              {moods.map(mood => (
                <Pressable key={mood.label} style={[s.moodItem, { backgroundColor: mood.color+'22' }]} onPress={() => selectMood(mood)}>
                  <View style={[s.moodCircle, { backgroundColor: mood.color }]}>
                    <Text style={s.moodCircleEmoji}>{mood.emoji}</Text>
                  </View>
                  <Text style={[s.moodItemLabel, { color: mood.color }]}>{mood.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 작성 모달 */}
      {createForm && (
        <Modal visible animationType="slide">
          <KeyboardAvoidingView style={{ flex:1, backgroundColor: N.white }} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
            <View style={s.createHeader}>
              <Pressable onPress={() => setCreateForm(null)} hitSlop={8}><Text style={s.cancelBtn}>취소</Text></Pressable>
              <Text style={s.createHeaderTitle}>일기 작성</Text>
              <Pressable onPress={submitDiary} hitSlop={8}><Text style={[s.submitBtn, { color: accentColor }]}>등록</Text></Pressable>
            </View>
            <ScrollView style={s.createBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={[s.selectedMoodRow, { backgroundColor: createForm.mood.color+'18' }]}>
                <Text style={s.selectedMoodEmoji}>{createForm.mood.emoji}</Text>
                <Text style={[s.selectedMoodLabel, { color: createForm.mood.color }]}>{createForm.mood.label}</Text>
                <Pressable style={s.changeMoodBtn} onPress={() => { setCreateForm(null); setShowMoodModal(true); }}>
                  <Text style={s.changeMoodText}>변경</Text>
                </Pressable>
              </View>
              <TextInput style={s.titleInput} placeholder="제목을 입력하세요" placeholderTextColor={N.gray300} value={createForm.title} onChangeText={t => setCreateForm(p => p ? { ...p, title:t } : p)} maxLength={50} />
              <View style={s.divider} />
              <TextInput style={s.contentInput} placeholder="오늘 있었던 일을 기록해보세요..." placeholderTextColor={N.gray300} value={createForm.content} onChangeText={t => setCreateForm(p => p ? { ...p, content:t } : p)} multiline textAlignVertical="top" />
              {createForm.image && (
                <View style={s.imgPreview}>
                  <Image source={{ uri: createForm.image }} style={s.imgPreviewImg} resizeMode="cover" />
                  <Pressable style={s.removeImgBtn} onPress={() => setCreateForm(p => p ? { ...p, image:null } : p)}>
                    <Text style={s.removeImgText}>✕</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
            <View style={s.createFooter}>
              <Pressable style={s.footerBtn} onPress={pickImage}>
                <Text style={s.footerBtnIcon}>🖼️</Text>
                <Text style={s.footerBtnLabel}>이미지 첨부</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:N.gray50 },
  fill: { flex:1, backgroundColor:N.gray50 },
  listContent: { flexGrow:1, padding:16, paddingBottom:90 },

  toggleWrap: { alignItems:'center', paddingVertical:14 },
  toggleRow: { flexDirection:'row', backgroundColor:N.gray100, borderRadius:10, padding:3, gap:2 },
  toggleBtn: { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:16, paddingVertical:8, borderRadius:8 },
  toggleText: { fontSize:13, fontFamily:'BMHANNAPro', color:N.gray400 },

  card: { backgroundColor:N.white, borderRadius:12, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.07, shadowRadius:4, elevation:2 },
  moodStrip: { height:4 },
  cardBody: { padding:14 },
  cardMeta: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  dateText: { fontSize:12, color:N.gray400, fontFamily:'BMHANNAPro' },
  moodBadge: { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  moodEmoji: { fontSize:14 },
  moodBadgeLabel: { fontSize:11, fontFamily:'BMHANNAPro' },
  entryTitle: { fontSize:16, fontFamily:'BMJUA', color:N.gray800, marginBottom:6 },
  entryContent: { fontSize:14, lineHeight:22, color:N.gray600, fontFamily:'BMHANNAPro' },
  entryImage: { width:'100%', aspectRatio:3/2, marginTop:10, borderRadius:8 },

  calMonthNav: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingBottom:10 },
  calMonthTitle: { fontSize:18, fontFamily:'BMJUA', color:N.gray800 },
  calCard: { marginHorizontal:12, backgroundColor:N.white, borderRadius:16, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.07, shadowRadius:6, elevation:2, overflow:'hidden' },
  calWeekRow: { flexDirection:'row', backgroundColor:N.gray50 },
  calGrid: { flexDirection:'row', flexWrap:'wrap' },
  calCell: { width:'14.2857%', alignItems:'center', paddingVertical:10 },
  calWeekDay: { fontSize:13, fontFamily:'BMHANNAPro', color:N.gray500, paddingVertical:8 },
  calDayCircle: { width:38, height:38, borderRadius:19, alignItems:'center', justifyContent:'center' },
  calDayText: { fontSize:15, fontFamily:'BMHANNAPro', color:N.gray700 },
  dotsRow: { flexDirection:'row', gap:3, marginTop:3, height:6 },
  dot: { width:6, height:6, borderRadius:3 },
  selectedDayTitle: { fontSize:15, fontFamily:'BMJUA', color:N.gray700, marginBottom:12 },
  selectedDayEmpty: { fontSize:13, fontFamily:'BMHANNAPro', color:N.gray400, textAlign:'center', paddingVertical:20 },

  fab: { position:'absolute', bottom:20, right:20, width:52, height:52, borderRadius:26, alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.18, shadowRadius:6, elevation:5 },

  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'center', alignItems:'center' },
  detailModal: { backgroundColor:N.white, borderRadius:20, width:'90%', maxWidth:380, maxHeight:'80%', overflow:'hidden' },
  detailHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, borderBottomColor:N.gray100 },
  detailHeaderRight: { flexDirection:'row', alignItems:'center', gap:8 },
  detailBody: { padding:16 },
  detailDate: { fontSize:13, color:N.gray400, fontFamily:'BMHANNAPro' },
  detailTitle: { fontSize:20, fontFamily:'BMJUA', color:N.gray800, marginBottom:12 },
  divider: { height:1, backgroundColor:N.gray100, marginVertical:8 },
  detailContent: { fontSize:15, fontFamily:'BMHANNAPro', color:N.gray700, lineHeight:26 },
  detailImage: { width:'100%', aspectRatio:3/2, marginTop:16, borderRadius:10 },

  moodModal: { backgroundColor:N.white, borderRadius:24, padding:28, width:'88%', maxWidth:360 },
  moodModalTitle: { fontSize:21, fontFamily:'BMJUA', color:N.gray800, textAlign:'center', lineHeight:32, marginBottom:22 },
  moodGrid: { flexDirection:'row', flexWrap:'wrap', gap:10, justifyContent:'center' },
  moodItem: { width:'22%', alignItems:'center', paddingVertical:10, paddingHorizontal:4, borderRadius:14, gap:6 },
  moodCircle: { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },
  moodCircleEmoji: { fontSize:26 },
  moodItemLabel: { fontSize:11, fontFamily:'BMHANNAPro', textAlign:'center' },

  createHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:Platform.OS==='ios'?56:20, paddingBottom:14, borderBottomWidth:1, borderBottomColor:N.gray100 },
  cancelBtn: { fontSize:15, color:N.gray500, fontFamily:'BMHANNAPro' },
  createHeaderTitle: { fontSize:16, fontFamily:'BMJUA', color:N.gray800 },
  submitBtn: { fontSize:15, fontFamily:'BMJUA' },
  createBody: { flex:1, paddingHorizontal:16, paddingTop:16 },
  selectedMoodRow: { flexDirection:'row', alignItems:'center', gap:8, paddingHorizontal:14, paddingVertical:10, borderRadius:20, marginBottom:16, alignSelf:'flex-start' },
  selectedMoodEmoji: { fontSize:20 },
  selectedMoodLabel: { fontSize:14, fontFamily:'BMJUA' },
  changeMoodBtn: { marginLeft:4, paddingHorizontal:8, paddingVertical:2, backgroundColor:'rgba(0,0,0,0.06)', borderRadius:10 },
  changeMoodText: { fontSize:11, color:N.gray500, fontFamily:'BMHANNAPro' },
  titleInput: { fontSize:18, fontFamily:'BMJUA', color:N.gray800, paddingVertical:8 },
  contentInput: { fontSize:15, fontFamily:'BMHANNAPro', color:N.gray700, lineHeight:24, minHeight:200, paddingTop:4 },
  imgPreview: { marginTop:14, borderRadius:12, overflow:'hidden' },
  imgPreviewImg: { width:'100%', aspectRatio:3/2 },
  removeImgBtn: { position:'absolute', top:8, right:8, width:28, height:28, borderRadius:14, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center' },
  removeImgText: { color:'#fff', fontSize:14 },
  createFooter: { flexDirection:'row', padding:12, paddingBottom:Platform.OS==='ios'?28:12, borderTopWidth:1, borderTopColor:N.gray100 },
  footerBtn: { flexDirection:'row', alignItems:'center', gap:6, paddingVertical:8, paddingHorizontal:12, borderRadius:10, backgroundColor:N.gray100 },
  footerBtnIcon: { fontSize:18 },
  footerBtnLabel: { fontSize:13, color:N.gray600, fontFamily:'BMHANNAPro' },
});
