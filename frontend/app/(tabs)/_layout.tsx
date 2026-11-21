import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { AuthColors } from '@/constants/theme';

const tabIcons = {
  home: { active: 'home', inactive: 'home-outline' },
  skills: { active: 'sparkles', inactive: 'sparkles-outline' },
  discover: { active: 'compass', inactive: 'compass-outline' },
  connections: { active: 'people', inactive: 'people-outline' },
  chat: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
} as const;

type TabName = keyof typeof tabIcons;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: AuthColors.primary,
        tabBarInactiveTintColor: AuthColors.secondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        tabBarStyle: {
          backgroundColor: AuthColors.card,
          borderTopColor: AuthColors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 4 : 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, size }) => {
          const icon = tabIcons[route.name as TabName];
          return (
            <Ionicons
              color={focused ? AuthColors.primary : AuthColors.secondary}
              name={focused ? icon.active : icon.inactive}
              size={size}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="skills" options={{ title: 'My Skills' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="connections" options={{ title: 'Connections' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
