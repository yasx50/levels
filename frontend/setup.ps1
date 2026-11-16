$files = @(
# ---------- app (Expo Router) ----------
"app/_layout.tsx","app/index.tsx",
"app/(auth)/_layout.tsx","app/(auth)/splash.tsx","app/(auth)/welcome.tsx","app/(auth)/login.tsx","app/(auth)/signup.tsx",
"app/(auth)/onboarding/personal-info.tsx","app/(auth)/onboarding/account-type.tsx","app/(auth)/onboarding/select-skills.tsx","app/(auth)/onboarding/profile-links.tsx","app/(auth)/onboarding/complete.tsx",
"app/(tabs)/_layout.tsx","app/(tabs)/home.tsx","app/(tabs)/discover.tsx","app/(tabs)/connections.tsx","app/(tabs)/chat.tsx","app/(tabs)/profile.tsx",
"app/skills/[skillId].tsx","app/skills/add.tsx",
"app/evidence/add.tsx","app/evidence/[evidenceId].tsx",
"app/users/[userId].tsx",
"app/connections/requests.tsx",
"app/chat/[conversationId].tsx",
"app/notifications/index.tsx",
"app/levels/index.tsx","app/levels/history.tsx",
"app/profile/edit.tsx",
"app/settings/index.tsx","app/settings/privacy.tsx","app/settings/account.tsx",

# ---------- features ----------
"src/features/home/screens/HomeScreen.tsx",
"src/features/home/components/HomeHeader.tsx","src/features/home/components/LevelBanner.tsx","src/features/home/components/ProfileStats.tsx","src/features/home/components/RecentActivity.tsx","src/features/home/components/RecommendedPeople.tsx","src/features/home/components/CommunityFeed.tsx",
"src/features/home/hooks/useHome.ts","src/features/home/services/homeService.ts","src/features/home/types/home.types.ts",

"src/features/discover/screens/DiscoverScreen.tsx","src/features/discover/screens/SkillDiscoveryScreen.tsx",

"src/features/profile/screens/MyProfileScreen.tsx","src/features/profile/screens/PublicProfileScreen.tsx","src/features/profile/screens/EditProfileScreen.tsx",
"src/features/profile/components/ProfileHeader.tsx","src/features/profile/components/ProfileStats.tsx","src/features/profile/components/ProfileSkills.tsx","src/features/profile/components/ProfileEvidence.tsx","src/features/profile/components/ProfileExperience.tsx","src/features/profile/components/ProfileLevelCard.tsx",

"src/features/skills/screens/SkillDetailScreen.tsx","src/features/skills/screens/AddSkillScreen.tsx",
"src/features/skills/components/SkillCard.tsx","src/features/skills/components/SkillStats.tsx","src/features/skills/components/SkillEvidence.tsx","src/features/skills/components/AcknowledgeButton.tsx",

"src/features/evidence/screens/AddEvidenceScreen.tsx","src/features/evidence/screens/EvidenceDetailScreen.tsx",
"src/features/evidence/components/EvidenceTypeSelector.tsx","src/features/evidence/components/EvidenceForm.tsx","src/features/evidence/components/EvidenceCard.tsx","src/features/evidence/components/VisibilitySelector.tsx",

"src/features/connections/screens/ConnectionsScreen.tsx","src/features/connections/screens/ConnectionRequestsScreen.tsx",

"src/features/chat/screens/ChatListScreen.tsx","src/features/chat/screens/ConversationScreen.tsx",
"src/features/chat/components/ConversationCard.tsx","src/features/chat/components/MessageBubble.tsx","src/features/chat/components/ChatInput.tsx",

"src/features/notifications/screens/NotificationsScreen.tsx",

"src/features/levels/screens/LevelEvolutionScreen.tsx","src/features/levels/screens/LevelHistoryScreen.tsx",
"src/features/levels/components/LevelTimeline.tsx","src/features/levels/components/LevelCard.tsx","src/features/levels/components/LevelProgress.tsx","src/features/levels/components/CivilizationIllustration.tsx",

"src/features/auth/screens/LoginScreen.tsx","src/features/auth/screens/SignupScreen.tsx","src/features/auth/screens/OnboardingScreen.tsx",

"src/features/settings/screens/SettingsScreen.tsx","src/features/settings/screens/PrivacyScreen.tsx","src/features/settings/screens/AccountScreen.tsx",

# ---------- global components ----------
"src/components/ui/AppButton.tsx","src/components/ui/AppInput.tsx","src/components/ui/AppCard.tsx","src/components/ui/AppAvatar.tsx","src/components/ui/AppBadge.tsx","src/components/ui/AppLoader.tsx","src/components/ui/EmptyState.tsx",
"src/components/layout/ScreenWrapper.tsx","src/components/layout/AppHeader.tsx","src/components/layout/AppBottomSheet.tsx",
"src/components/navigation/CustomTabBar.tsx",

# ---------- theme / providers / store / services / hooks / constants / types / utils ----------
"src/theme/colors.ts","src/theme/typography.ts","src/theme/spacing.ts","src/theme/radius.ts","src/theme/commonTheme.ts","src/theme/levelThemes.ts","src/theme/index.ts",
"src/providers/AuthProvider.tsx","src/providers/LevelThemeProvider.tsx",
"src/store/authStore.ts","src/store/userStore.ts","src/store/notificationStore.ts",
"src/services/api/apiClient.ts","src/services/api/endpoints.ts","src/services/storage/secureStorage.ts",
"src/hooks/useAuth.ts","src/hooks/useCurrentUser.ts",
"src/constants/app.ts","src/constants/levels.ts","src/constants/evidenceTypes.ts",
"src/types/user.types.ts","src/types/navigation.types.ts","src/types/api.types.ts",
"src/utils/formatDate.ts","src/utils/formatNumber.ts","src/utils/validators.ts",

# ---------- root ----------
".env"
)

# Empty feature sub-folders (components/hooks/services/types)
$features = "home","discover","profile","skills","evidence","connections","chat","notifications","levels","auth"
foreach ($f in $features) {
  foreach ($s in "components","hooks","services","types") {
    New-Item -ItemType Directory -Force -Path "src/features/$f/$s" | Out-Null
  }
}
New-Item -ItemType Directory -Force -Path "src/features/settings/components" | Out-Null

# Asset folders
foreach ($d in "images","icons","fonts") { New-Item -ItemType Directory -Force -Path "assets/$d" | Out-Null }
foreach ($c in "first-fire","survival","civilization","industrial","electrical","modern","digital","ai","space","mars") {
  New-Item -ItemType Directory -Force -Path "assets/illustrations/civilizations/$c" | Out-Null
}

# Create files (skips ones that already exist)
foreach ($f in $files) {
  $dir = Split-Path $f -Parent
  if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (Test-Path -LiteralPath $f) { continue }

  $name = [IO.Path]::GetFileNameWithoutExtension($f)

  if ($f -like "*.tsx") {
    $comp = ($name -replace '[^A-Za-z0-9]', '')
    $comp = $comp.Substring(0,1).ToUpper() + $comp.Substring(1)

    if ($name -eq "_layout") {
      $body = @"
import { Slot } from 'expo-router';

export default function Layout() {
  return <Slot />;
}
"@
    } else {
      $body = @"
import { View, Text } from 'react-native';

export default function $comp() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>$comp</Text>
    </View>
  );
}
"@
    }
    Set-Content -LiteralPath $f -Value $body -Encoding UTF8
  }
  elseif ($f -like "*.ts") {
    Set-Content -LiteralPath $f -Value "export {};" -Encoding UTF8
  }
  else {
    New-Item -ItemType File -Path $f | Out-Null
  }
}

Write-Host "Done! Project structure created." -ForegroundColor Green