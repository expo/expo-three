# expo-three example app

to get started:

1. Ensure the local `expo-three` package is built:

```bash
yarn
yarn build
# CMD+C to exit watch mode
```

2. cd into the example directory and run the app:

```bash
cd example
yarn
yarn prebuild:clean
yarn android # or ios
```

> Note that you should run this example on a real device, as the iOS simulator has no support for WebGL. YMMV on Android emulators.
