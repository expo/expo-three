import { Stack, Link } from 'expo-router';
import { THREE } from 'expo-three';
import { FlatList, Text, View } from 'react-native';

// add new scenes here
const SCENES: { name: string; href: string }[] = [
  { name: 'Spinning Cubes', href: '/spinning-cubes' },
  { name: 'Cube with Physical Material', href: '/cube-mesh-physical-material' },
  { name: 'Animated Robot (Skinning & Morphing)', href: '/animated-robot' },
  { name: 'Field of Flowers', href: '/flower-field' },
  { name: 'Interactive Buffergeometry', href: '/interactive-buffergeometry' },
  { name: 'GCode Loader 🚢', href: '/gcode-loader' },
  { name: 'Head model with material', href: '/head-model' },
  { name: 'Bouncing Balls w/ Image Picker', href: '/bouncing-balls' },
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
      <View
        style={{
          alignItems: 'center',
          padding: 16,
          borderTopColor: '#cccccc',
          borderTopWidth: 1,
        }}
      >
        <Text>
          THREE.js version:
          <Text style={{ fontWeight: 'bold' }}> 0.{THREE.REVISION}</Text>
        </Text>
      </View>
    </>
  );
}
