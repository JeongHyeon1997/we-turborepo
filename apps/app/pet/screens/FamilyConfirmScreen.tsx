import { View, Text, Pressable, StyleSheet } from 'react-native';
import { petColors } from '@we/utils';

interface FamilyMember { id: string; name: string; avatarColor: string; }
interface FamilyGroup { members: FamilyMember[]; groupStartDate: string; }

const ACCENT = '#97A4D9';

function Avatar({ color, name, size = 56 }: { color: string; name: string; size?: number }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: size * 0.38, fontFamily: 'BMJUA', color: '#fff' }}>{name[0]}</Text>
    </View>
  );
}

interface Props {
  newMember: FamilyMember;
  existingGroup: FamilyGroup | null;
  onAccept: () => void;
  onDecline: () => void;
}

export function FamilyConfirmScreen({ newMember, existingGroup, onAccept, onDecline }: Props) {
  const existingCount = existingGroup?.members.length ?? 0;

  return (
    <View style={s.page}>
      <View style={s.card}>
        {/* 아바타 행: 나 + 기존 멤버 + 새 멤버 */}
        <View style={s.avatarRow}>
          <Avatar color={ACCENT + '88'} name="나" />
          {existingGroup?.members.slice(0, 3).map(m => (
            <Avatar key={m.id} color={m.avatarColor} name={m.name} size={40} />
          ))}
          <Text style={s.plus}>+</Text>
          <Avatar color={newMember.avatarColor} name={newMember.name} />
        </View>

        <Text style={s.title}>
          <Text style={{ color: ACCENT }}>{newMember.name}</Text>님을{'\n'}가족으로 추가할까요?
        </Text>
        <Text style={s.sub}>초대 코드로 연결 요청이 왔어요.</Text>

        {existingCount > 0 && (
          <Text style={s.memberCount}>현재 가족 {existingCount}명 → {existingCount + 1}명</Text>
        )}

        <View style={s.memberInfo}>
          <View style={[s.memberDot, { backgroundColor: newMember.avatarColor }]} />
          <Text style={s.memberName}>{newMember.name}</Text>
        </View>

        <View style={s.btnRow}>
          <Pressable style={({ pressed }) => [s.declineBtn, pressed && { opacity: 0.7 }]} onPress={onDecline}>
            <Text style={s.declineBtnText}>거절</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.acceptBtn, pressed && { opacity: 0.85 }]} onPress={onAccept}>
            <Text style={s.acceptBtnText}>추가 🐾</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, backgroundColor: petColors.gray50,
  },
  card: {
    width: '100%', maxWidth: 360,
    backgroundColor: petColors.white,
    borderRadius: 24, padding: 28,
    alignItems: 'center', gap: 14,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
    borderWidth: 1, borderColor: ACCENT + '33',
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  plus: { fontSize: 18, color: petColors.gray400, fontFamily: 'BMJUA', marginHorizontal: 4 },
  title: {
    fontSize: 19, fontFamily: 'BMJUA',
    color: petColors.gray900, textAlign: 'center', lineHeight: 28,
  },
  sub: { fontSize: 13, fontFamily: 'BMHANNAPro', color: petColors.gray500, textAlign: 'center', marginTop: -4 },
  memberCount: { fontSize: 13, fontFamily: 'BMJUA', color: petColors.gray500 },
  memberInfo: {
    width: '100%', padding: 12, paddingHorizontal: 16,
    backgroundColor: ACCENT + '18', borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  memberDot: { width: 10, height: 10, borderRadius: 5 },
  memberName: { fontSize: 14, fontFamily: 'BMJUA', color: petColors.gray800 },
  btnRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  declineBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: petColors.gray200, alignItems: 'center',
  },
  declineBtnText: { fontSize: 15, fontFamily: 'BMJUA', color: petColors.gray500 },
  acceptBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 14,
    backgroundColor: ACCENT, alignItems: 'center',
  },
  acceptBtnText: { fontSize: 15, fontFamily: 'BMJUA', color: petColors.white },
});
