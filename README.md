# Plaudern

Plaudern is a mobile chat app built with React Native (Expo) and Firebase.  
Users can sign in anonymously, pick a chat background color, and exchange messages in real time, including images and location pins.

## Features

- Anonymous sign-in with Firebase Authentication
- Real-time messaging with Cloud Firestore
- Offline support with local message caching (`AsyncStorage`)
- Send images from gallery or camera
- Share current location in chat
- Tap chat images to view them full-screen
- Connectivity awareness (Firestore network is disabled when offline)

## Tech Stack

- React Native + Expo
- React Navigation (native stack)
- Firebase:
  - Authentication
  - Firestore
  - Storage
- `react-native-gifted-chat` for chat UI
- `expo-image-picker` and `expo-location`
- `react-native-maps` and `react-native-image-zoom-viewer`

## Project Structure

```text
.
|- App.js                     # App entry, Firebase setup, navigation
|- components/
|  |- Start.js                # Name + background color + anonymous sign-in
|  |- Chat.js                 # Chat screen, realtime sync, offline cache
|  |- CustomActions.js        # Image/location actions + Firebase Storage upload
|- assets/images/             # App icons and background image
|- app.json                   # Expo app config
|- package.json               # Scripts and dependencies
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo Go app (for running on a physical device), or Android/iOS simulator

### Install and Run

```bash
npm install
npm start
```

Then use the Expo options to run on:
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Available Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Launch Android target
- `npm run ios` - Launch iOS target
- `npm run web` - Launch web target
- `npm run lint` - Run linting with Expo ESLint config

## Notes

- Firebase project configuration is currently initialized in `App.js`.
- Image uploads are stored in Firebase Storage and sent as message URLs.
- Location sharing requires device location permissions.
