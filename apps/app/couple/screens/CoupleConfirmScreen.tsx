import { View, Text, Pressable, StyleSheet } from 'react-native';
import { coupleColors } from '@we/utils';

interface CouplePartner { id: string; name: string; avatarColor: string; }

const ACCENT = '#f4a0a0';

function Avatar({ color, name, size = 72 }: { color: string; name: string; size?: number }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ fontSize: size * 0.4, fontFamily: 'BMJUA', color: '#fff' }}>
        {name[0]}
      </Text>
    </View>
  );
}

interface Props {
  partner: CouplePartner;
  onAccept: () => void;
  onDecline: () => void;
}

export function CoupleConfirmScreen({ partner, onAccept, onDecline }: Props) {
  return (
    <View style={s.page}>
      <View style={s.card}>
        {/* 아바타 페어 */}
        <View style={s.avatarRow}>
          <Avatar color={coupleColors.primary300} name="나" />
          <Text style={s.heart}>💕</Text>
          <Avatar color={partner.avatarColor} name={partner.name} />
        </View>

        <Text style={s.title}>{partner.name}님과 커플이신가요?</Text>
        <Text style={s.sub}>초대 코드로 연결 요청이 왔어요.</Text>

        <View style={s.partnerInfo}>
          <View style={s.partnerRow}>
            <View style={[s.partnerDot, { backgroundColor: partner.avatarColor }]} />
            <Text style={s.partnerName}>{partner.name}</Text>
          </View>
        </View>

        <View style={s.btnRow}>
          <Pressable
            style={({ pressed }) => [s.declineBtn, pressed && { opacity: 0.7 }]}
            onPress={onDecline}
          >
            <Text style={s.declineBtnText}>거절</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.acceptBtn, pressed && { opacity: 0.85 }]}
            onPress={onAccept}
          >
            <Text style={s.acceptBtnText}>수락 💕</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
    backgroundColor: coupleColors.gray50,
  },
  card: {
    width: '100%', maxWidth: 360,
    backgroundColor: coupleColors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center', gap: 16,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
    borderWidth: 1, borderColor: coupleColors.primary100,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 4 },
  heart: { fontSize: 32 },
  title: {
    fontSize: 20, fontFamily: 'BMJUA',
    color: coupleColors.gray900, textAlign: 'center',
  },
  sub: {
    fontSize: 13, fontFamily: 'BMHANNAPro',
    color: coupleColors.gray500, textAlign: 'center',
    marginTop: -8,
  },
  partnerInfo: {
    width: '100%',
    padding: 12, paddingHorizontal: 16,
    backgroundColor: coupleColors.primary50, borderRadius: 12,
  },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  partnerDot: { width: 10, height: 10, borderRadius: 5 },
  partnerName: { fontSize: 14, fontFamily: 'BMJUA', color: coupleColors.gray800 },
  btnRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  declineBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1, borderColor: coupleColors.gray200,
    alignItems: 'center',
  },
  declineBtnText: { fontSize: 15, fontFamily: 'BMJUA', color: coupleColors.gray500 },
  acceptBtn: {
    flex: 2, paddingVertical: 14,
    borderRadius: 14, backgroundColor: ACCENT, alignItems: 'center',
  },
  acceptBtnText: { fontSize: 15, fontFamily: 'BMJUA', color: coupleColors.white },
});
