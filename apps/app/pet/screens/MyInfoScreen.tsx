import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { petColors } from '@we/utils';

const mockUser = {
  nickname: '우리새끼',
  profileImage: null as string | null,
  followers: 84,
  following: 32,
};

export function MyInfoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        {mockUser.profileImage ? (
          <Image source={{ uri: mockUser.profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={48} color={petColors.gray400} />
          </View>
        )}
      </View>

      <Text style={styles.nickname}>{mockUser.nickname}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{mockUser.followers}</Text>
          <Text style={styles.statLabel}>팔로워</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{mockUser.following}</Text>
          <Text style={styles.statLabel}>팔로잉</Text>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}>
        <Text style={styles.editButtonText}>프로필 편집</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  avatarWrap: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    backgroundColor: petColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: petColors.gray900,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: petColors.gray900,
  },
  statLabel: {
    fontSize: 13,
    color: petColors.gray500,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: petColors.gray200,
  },
  editButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: petColors.blue,
  },
  editButtonPressed: {
    backgroundColor: petColors.surface,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: petColors.gray700,
  },
});
