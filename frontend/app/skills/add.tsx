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
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/theme';
import { useCreateSkill, useSkills, useSkillSuggestions } from '@/hooks/useSkills';
import {
  SKILL_CATEGORIES,
  type CreateSkillInput,
  type ProficiencyLevel,
  type SkillCategory,
} from '@/types/skills';

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

export default function AddSkill() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory | null>(null);
  const [years, setYears] = useState('0');
  const [months, setMonths] = useState('0');
  const [proficiency, setProficiency] = useState<ProficiencyLevel | null>(null);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const { data: skills } = useSkills();
  const { data: suggestions = [], isFetching: isSearching } = useSkillSuggestions(name);
  const createSkill = useCreateSkill();

  const showCustomSuggestion = useMemo(
    () =>
      trimmedName.length > 0 &&
      !suggestions.some(
        (suggestion) => suggestion.name.toLowerCase() === trimmedName.toLowerCase(),
      ),
    [suggestions, trimmedName],
  );

  const selectSuggestion = (suggestedName: string, suggestedCategory: SkillCategory) => {
    setName(suggestedName);
    setCategory(suggestedCategory);
    setFormError(null);
  };

  const submit = async () => {
    const cleanYears = years.trim();
    const cleanMonths = months.trim();
    const experienceYears = Number.parseInt(cleanYears || '0', 10);
    const experienceMonths = Number.parseInt(cleanMonths || '0', 10);

    if (!trimmedName) {
      setFormError('Enter a skill name to continue.');
      return;
    }
    if (!category) {
      setFormError('Choose a category for this skill.');
      return;
    }
    if (!proficiency) {
      setFormError('Choose your proficiency level.');
      return;
    }
    if (
      Number.isNaN(experienceYears) ||
      (cleanYears !== '' && !/^\d+$/.test(cleanYears)) ||
      experienceYears < 0 ||
      Number.isNaN(experienceMonths) ||
      (cleanMonths !== '' && !/^\d+$/.test(cleanMonths)) ||
      experienceMonths < 0 ||
      experienceMonths > 11
    ) {
      setFormError('Enter whole years and between 0 and 11 months.');
      return;
    }
    if (
      skills?.some(
        (skill) => skill.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setFormError('You have already added this skill.');
      return;
    }

    setFormError(null);
    const input: CreateSkillInput = {
      name: trimmedName,
      category,
      experienceYears,
      experienceMonths,
      proficiency,
      description: description.trim() || undefined,
    };

    try {
      await createSkill.mutateAsync(input);
      Alert.alert('Skill added', `${trimmedName} is now part of your profile.`);
      router.back();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'We could not save this skill. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Close add skill"
            accessibilityRole="button"
            hitSlop={8}
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons color={AuthColors.text} name="close" size={22} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Add a skill</Text>
            <Text style={styles.subtitle}>Share what you bring to your work.</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>
            Skill name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrap}>
            <Ionicons color={AuthColors.muted} name="search-outline" size={18} />
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={60}
              placeholder="Search or enter a skill"
              placeholderTextColor={AuthColors.muted}
              returnKeyType="done"
              style={styles.input}
              value={name}
              onChangeText={(value) => {
                setName(value);
                setFormError(null);
              }}
            />
            {isSearching ? <ActivityIndicator color={AuthColors.primary} size="small" /> : null}
          </View>

          {(suggestions.length > 0 || showCustomSuggestion) && (
            <View style={styles.suggestionList}>
              {suggestions.slice(0, 5).map((suggestion) => (
                <Pressable
                  key={suggestion.name}
                  accessibilityRole="button"
                  style={styles.suggestion}
                  onPress={() => selectSuggestion(suggestion.name, suggestion.category)}
                >
                  <Text style={styles.suggestionName}>{suggestion.name}</Text>
                  <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                </Pressable>
              ))}
              {showCustomSuggestion ? (
                <Pressable
                  accessibilityRole="button"
                  style={[styles.suggestion, styles.customSuggestion]}
                  onPress={() => {
                    setName(trimmedName);
                    setCategory(category ?? 'Other');
                  }}
                >
                  <Text style={styles.suggestionName}>Use “{trimmedName}”</Text>
                  <Text style={styles.suggestionCategory}>Custom</Text>
                </Pressable>
              ) : null}
            </View>
          )}

          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipWrap}>
            {SKILL_CATEGORIES.map((item) => (
              <ChoiceChip
                key={item}
                label={item}
                selected={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>Experience</Text>
          <View style={styles.experienceRow}>
            <View style={styles.experienceInputGroup}>
              <TextInput
                accessibilityLabel="Years of experience"
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="done"
                style={styles.numberInput}
                value={years}
                onChangeText={setYears}
              />
              <Text style={styles.unit}>years</Text>
            </View>
            <View style={styles.experienceInputGroup}>
              <TextInput
                accessibilityLabel="Months of experience"
                keyboardType="number-pad"
                maxLength={2}
                returnKeyType="done"
                style={styles.numberInput}
                value={months}
                onChangeText={setMonths}
              />
              <Text style={styles.unit}>months</Text>
            </View>
          </View>

          <Text style={styles.label}>
            Proficiency <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipWrap}>
            {PROFICIENCY_LEVELS.map((item) => (
              <ChoiceChip
                key={item}
                label={item}
                selected={proficiency === item}
                onPress={() => setProficiency(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>
            Description <Text style={styles.optional}>Optional</Text>
          </Text>
          <TextInput
            multiline
            maxLength={180}
            placeholder="A short line about how you use this skill"
            placeholderTextColor={AuthColors.muted}
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.characterCount}>{description.length}/180</Text>

          {formError ? (
            <View accessibilityRole="alert" style={styles.errorBanner}>
              <Ionicons color="#A33B2B" name="alert-circle-outline" size={17} />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={createSkill.isPending}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !createSkill.isPending && styles.pressed,
              createSkill.isPending && styles.disabled,
            ]}
            onPress={() => void submit()}
          >
            {createSkill.isPending ? (
              <ActivityIndicator color={AuthColors.card} />
            ) : (
              <>
                <Text style={styles.submitText}>Add Skill</Text>
                <Ionicons color={AuthColors.card} name="arrow-forward" size={17} />
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>
    </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: AuthColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: AuthColors.secondary,
    fontSize: 11,
    marginTop: 3,
  },
  form: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    width: '100%',
  },
  label: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 17,
  },
  required: {
    color: AuthColors.primary,
  },
  optional: {
    color: AuthColors.secondary,
    fontSize: 10,
    fontWeight: '400',
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 13,
  },
  input: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  suggestionList: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 11,
    borderWidth: 1,
    marginTop: 5,
    overflow: 'hidden',
  },
  suggestion: {
    alignItems: 'center',
    borderBottomColor: AuthColors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 42,
    paddingHorizontal: 13,
  },
  customSuggestion: {
    backgroundColor: '#FAF9F5',
  },
  suggestionName: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  suggestionCategory: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 11,
  },
  selectedChip: {
    backgroundColor: '#F8EEE8',
    borderColor: AuthColors.primary,
  },
  chipText: {
    color: AuthColors.secondary,
    fontSize: 10,
    fontWeight: '600',
  },
  selectedChipText: {
    color: AuthColors.primary,
  },
  experienceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  experienceInputGroup: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  numberInput: {
    color: AuthColors.text,
    fontSize: 14,
    minWidth: 38,
    paddingVertical: 8,
  },
  unit: {
    color: AuthColors.secondary,
    fontSize: 11,
  },
  descriptionInput: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 11,
    borderWidth: 1,
    flex: 0,
    height: 84,
    paddingHorizontal: 13,
  },
  characterCount: {
    color: AuthColors.muted,
    fontSize: 9,
    marginTop: 5,
    textAlign: 'right',
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
  submitButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 11,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 48,
  },
  submitText: {
    color: AuthColors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.82,
  },
});
