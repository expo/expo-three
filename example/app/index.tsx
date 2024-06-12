import { FlatList, Text, View } from 'react-native';
import { Stack, Link } from 'expo-router';

// add new scenes here
const SCENES: { name: string; href: string }[] = [
  { name: 'Cube with Physical Material', href: '/cube-mesh-physical-material' },
  { name: 'Animated Robot (Skinning & Morphing)', href: '/animated-robot' },
  { name: 'Field of Flowers', href: '/flower-field' },
  { name: 'Interactive Buffergeometry', href: '/interactive-buffergeometry' },
  { name: 'GCode Loader 🚢', href: '/gcode-loader' },
];

export default function Page() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Expo Three Examples',
        }}
      />

      <FlatList
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 16,
        }}
        data={SCENES}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: '#cccccc' }} />
        )}
        renderItem={({ item }) => (
          <Link
            href={item.href}
            style={{
              paddingVertical: 16,
            }}
          >
            <Text>{item.name}</Text>
          </Link>
        )}
      />
    </>
  );
}
