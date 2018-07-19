# Three.js Demo

A comprehensive set of examples.

## Deployment
Unfortunetly Apple will reject apps that reference ARKit without a direct usage. 🙄
Because of this, when we deploy we need to do a few extra things.

### Detach 
This will create an XCode project that we can add extra pods to.
```sh
exp detach
```

After you have detached, open the Podfile. I use `code` which opens the file in VSCode. 
You can use whatever editor you like.
```sh
code ios/Podfile
```

Inside the `Podfile` you want to add the `AR` Pod.
Notice we are just adding `"AR"`, nothing crazy 😁
```rb

source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '9.0'

EXPO_CPP_HEADER_DIR = 'ExpoKit'

target 'expo-three' do
  pod 'ExpoKit',
    :git => "http://github.com/expo/expo.git",
    :tag => "ios/2.6.5",
    :subspecs => [
      "Core",
      "CPP",
      "GL",
      # HERE: Add the AR pod which should be at line ~14
      "AR"
    ],
    :inhibit_warnings => true
  
  ...
  
  other stuff in podfile.
  
```

Now we can install the pods by running.
```sh
pod install
```
That's it! Now we just need to deploy the iOS build.

### Using Fastlane
It's pretty easy to upload iOS apps using Fastlane. If you are really good you don't even need to touch iTunes :D

What we need to do is: 
* Setup Fastlane:
```sh
fastlane init
```
* Setup a private repo for your certificates. You can create free private repos using GitLab.
```sh
fastlane match init && fastlane match appstore
```
* **Optional:** Create the project in iTunesConnect. We can do this with a simple fastlane command. Run 
```sh
fastlane produce
```
* You can create your binary running:
```sh
fastlane release
```

That's it! open an issue if you found a problem, getting this to be as easy as possible is the goal.

## What's in the App?
This example will show you a bunch of cool things you can do with Expo + Three.js. 
Here is a list of what we've currently got. 
> Open an issue with something you want to see added.


## AR
A couple of ARKit examples, ARCore not currently supported.

### Basic

An example of starting the AR camera with three.js in any size viewport.

### Measure

Tap the screen to place an anchor, tap again to get the distance between the two points.
(Imperial system because 🇺🇸)

### Model

Realistic lighting using the Kelvin and Lumen data from ARKit.
This also demonstrates how to add a shadow to an invisible plane.

### Face

iPhone X only, this shows how to query facial input from the front facing camera.

### Image

When you point your camera at the clone trooper image (`/assets/marker.jpg`), a clone will appear.
![This is not the placeholder you are looking for](assets/marker.jpg '-> Add another starwars joke here')

### HitTest

This shows how to place an object by tapping anywhere on the screen.

### Points

Renders all the raw point data

### Planes

Renders all the raw plane anchors

## Basic

### Cube Texture

### Legacy

### Simple

## Loaders

Examples of loading in a variety of model types.

> Some of the more obscure ones don't work: msgpack, draco, x
### AMF Loader

### ASSIMP Loader

### BABYLON Loader

### BVH Loader

### DAE Loader

### DAE Rigged Loader

### DRACO Loader

### MSGPACK Loader

### MTL Loader

### OBJ Loader

### PCD Binary Loader

### PLY Binary Loader

### PLY Loader

### STL Binary Loader

### STL Loader

### 3DS Loader (tds)

### TMF Loader

### VTK Loader

### VTP Loader

### VTP non-Compressed Loader

### X Loader

## Shaders 

### Lava

### Sky

## Effects

### Anaglyph

### Glitch

### Parallax Barrier

### Intoxication

### Vignette

### Virtual Boy 

