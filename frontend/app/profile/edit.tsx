import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/profile/ProfileSections';
import { AuthColors } from '@/constants/theme';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import type {
  ProfileChecklist,
  ProfileFormData,
  UserProfile,
} from '@/types/profile';

export default function EditProfile() {
  const { data, isPending, error } = useProfile();
  const profile = data?.profile ?? null;

  return (
    <EditProfileForm
      key={profile?.id ?? 'loading'}
      error={error}
      isPending={isPending}
      profile={profile}
    />
  );
}

function EditProfileForm({
  profile,
  isPending,
  error,
}: {
  profile: UserProfile | null;
  isPending: boolean;
  error: unknown;
}) {
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<ProfileFormData>(() =>
    profile
      ? {
          name: profile.name,
          role: [profile.designation, profile.specialization]
            .filter(Boolean)
            .join(' · '),
          location: profile.location,
          bio: profile.bio,
          visibleInDiscover: profile.profileVisibility.visibleInDiscover,
        }
      : {
          name: '',
          role: '',
          location: '',
          bio: '',
          visibleInDiscover: true,
        },
  );
  const [formError, setFormError] = useState<string | null>(null);

  const checklist = useMemo<ProfileChecklist>(() => {
    const items = [
      { label: 'Add your full name.', completed: form.name.trim().length > 0 },
      { label: 'Add your professional role.', completed: form.role.trim().length > 0 },
      { label: 'Add your location.', completed: form.location.trim().length > 0 },
      { label: 'Write a profile bio.', completed: form.bio.trim().length > 0 },
    ];
    const completedCount = items.filter((item) => item.completed).length;
    return {
      items,
      completedCount,
      totalCount: items.length,
      completionPercentage: Math.round((completedCount / items.length) * 100),
    };
  }, [form]);

  const initials = form.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  const setField = (field: keyof ProfileFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError(null);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setFormError('Enter your full name to continue.');
      return;
    }
    if (!form.role.trim()) {
      setFormError('Enter your professional role to continue.');
      return;
    }

    setFormError(null);
    try {
      await updateProfile.mutateAsync({
        ...form,
        name: form.name.trim(),
        role: form.role.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
      });
      Alert.alert('Profile updated', 'Your profile changes have been saved.');
      router.back();
    } catch (saveError) {
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : 'We could not save your profile. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to Profile"
          accessibilityRole="button"
          hitSlop={8}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons color={AuthColors.text} name="chevron-back" size={21} />
          <Text style={styles.backLabel}>Profile</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={styles.headerAvatar}>
          <ProfileAvatar
            avatarUrl={profile?.avatarUrl ?? null}
            initials={initials || 'S'}
            name={form.name || 'Your profile'}
            size={36}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        {isPending ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={AuthColors.primary} />
            <Text style={styles.loadingText}>Loading your profile...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingState}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={24} />
            <Text style={styles.loadingText}>We couldn&apos;t load your profile.</Text>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.form}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.introduction}>
                <Text style={styles.heading}>Make your identity easier to trust.</Text>
                <Text style={styles.subtitle}>
                  Keep your role, story, and working context current.
                </Text>
              </View>

              <ProfileField
                label="Full name"
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(value) => setField('name', value)}
              />
              <ProfileField
                label="Role"
                placeholder="Enter your professional role"
                value={form.role}
                onChangeText={(value) => setField('role', value)}
              />
              <ProfileField
                label="Location"
                placeholder="Enter your location"
                value={form.location}
                onChangeText={(value) => setField('location', value)}
              />
              <ProfileField
                bio
                label="Bio"
                placeholder="Tell people about yourself"
                value={form.bio}
                onChangeText={(value) => setField('bio', value)}
              />

              <View style={styles.visibilitySection}>
                <Text style={styles.sectionTitle}>Profile visibility</Text>
                <View style={styles.visibilityRow}>
                  <Text style={styles.visibilityLabel}>Show my profile in Discover</Text>
                  <Switch
                    accessibilityLabel="Show my profile in Discover"
                    onValueChange={(value) => setField('visibleInDiscover', value)}
                    thumbColor={AuthColors.card}
                    trackColor={{
                      false: '#CCC9C0',
                      true: AuthColors.primary,
                    }}
                    value={form.visibleInDiscover}
                  />
                </View>
                <Text style={styles.visibilityCopy}>
                  People can still find you through shared connections when this is off.
                </Text>
              </View>

              <View style={styles.checklistCard}>
                <View style={styles.checklistHeader}>
                  <Text style={styles.checklistTitle}>Profile checklist</Text>
                  <Text style={styles.checklistPercentage}>
                    {checklist.completedCount}/{checklist.totalCount} ·{' '}
                    {checklist.completionPercentage}%
                  </Text>
                </View>
                {checklist.items.map((item) => (
                  <View key={item.label} style={styles.checklistItem}>
                    <View
                      style={[
                        styles.checklistIndicator,
                        item.completed && styles.checklistIndicatorCompleted,
                      ]}
                    >
                      {item.completed ? (
                        <Ionicons color={AuthColors.card} name="checkmark" size={12} />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.checklistLabel,
                        item.completed && styles.checklistLabelCompleted,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              {formError ? (
                <View accessibilityRole="alert" style={styles.errorBanner}>
                  <Ionicons color="#A33B2B" name="alert-circle-outline" size={17} />
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                accessibilityRole="button"
                disabled={updateProfile.isPending}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && !updateProfile.isPending && styles.pressed,
                  updateProfile.isPending && styles.disabled,
                ]}
                onPress={() => void save()}
              >
                {updateProfile.isPending ? (
                  <ActivityIndicator color={AuthColors.card} />
                ) : (
                  <Text style={styles.saveText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ProfileFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  bio?: boolean;
};

function ProfileField({
  label,
  placeholder,
  value,
  onChangeText,
  bio = false,
}: ProfileFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={bio ? 'sentences' : 'words'}
        multiline={bio}
        placeholder={placeholder}
        placeholderTextColor={AuthColors.muted}
        returnKeyType={bio ? 'default' : 'next'}
        style={[styles.input, bio && styles.bioInput]}
        textAlignVertical={bio ? 'top' : 'center'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AuthColors.background,
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: AuthColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 14,
    position: 'absolute',
  },
  backLabel: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  headerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
  },
  form: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingBottom: 18,
    paddingHorizontal: 20,
    width: '100%',
  },
  introduction: {
    paddingBottom: 4,
    paddingTop: 20,
  },
  heading: {
    color: AuthColors.text,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  fieldGroup: {
    marginTop: 17,
  },
  fieldLabel: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 11,
    borderWidth: 1,
    color: AuthColors.text,
    fontSize: 13,
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  bioInput: {
    height: 92,
  },
  visibilitySection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  visibilityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  visibilityLabel: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  visibilityCopy: {
    color: AuthColors.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginRight: 58,
    marginTop: 3,
  },
  checklistCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 18,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  checklistHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  checklistTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  checklistPercentage: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  checklistItem: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 34,
  },
  checklistIndicator: {
    alignItems: 'center',
    borderColor: AuthColors.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    marginRight: 9,
    width: 20,
  },
  checklistIndicatorCompleted: {
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
  },
  checklistLabel: {
    color: AuthColors.secondary,
    fontSize: 11,
  },
  checklistLabelCompleted: {
    color: AuthColors.text,
  },
  errorBanner: {
    alignItems: 'center',
    backgroundColor: '#FAEEEA',
    borderRadius: 9,
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
    padding: 11,
  },
  errorText: {
    color: '#8E3226',
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    alignSelf: 'center',
    backgroundColor: AuthColors.background,
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
    width: '100%',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 11,
    justifyContent: 'center',
    minHeight: 48,
  },
  saveText: {
    color: AuthColors.card,
    fontSize: 12,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.82,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: AuthColors.secondary,
    fontSize: 12,
    marginTop: 8,
  },
});
