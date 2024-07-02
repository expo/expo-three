/**
 * Add the Image Picker plugin with a permission request for photos.
 */
export const withImagePicker = [
  'expo-image-picker',
  {
    photosPermission:
      'The app accesses your photos to let you share them with your friends.',
  },
];
