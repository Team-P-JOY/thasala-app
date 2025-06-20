# Fixing expo-notifications Import and Building with EAS

## Problem:

When trying to use `import * as Notifications from "expo-notifications"`, you encounter errors and the build fails.

## Solutions:

### 1. Clean Your Project

Run the cleanup script to clear caches and reinstall dependencies:

```bash
npm run clean
```

This script will:

- Remove node_modules, .expo, and cache directories
- Clear the Metro bundler cache
- Reinstall all dependencies

### 2. Check Notifications Module

Add this code to check if the notifications module is working correctly:

```javascript
import * as Notifications from "expo-notifications";

// Then in your component:
console.log(
  Notifications ? "Module loaded successfully" : "Module failed to load"
);
```

### 3. Build with Debug Flag

When running EAS build, use the --verbose flag to see more details:

```bash
npx eas build --platform android --profile preview --verbose
```

### 4. Common Issues & Fixes

#### Module Resolution Issues

- Ensure your `app.json` has the correct plugin configuration:
  ```json
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/images/thasala-logo.png",
        "color": "#ffffff"
      }
    ]
  ]
  ```

#### Android-specific Issues

- If building for Android fails, try using the APK build type instead of AAB
- Ensure you have the correct permissions in `app.json`:
  ```json
  "android": {
    "permissions": ["NOTIFICATIONS", "VIBRATE"]
  }
  ```

#### Dependency Conflicts

- If you encounter odd module resolution errors, try:
  ```bash
  npm dedupe
  ```

### 5. Last Resort Solutions

If all else fails:

1. Create a new Expo project: `npx create-expo-app@latest MyApp`
2. Install expo-notifications: `npm install expo-notifications`
3. Compare the configuration with your current project
4. Copy your code and assets to the new project

## Testing Your Build

After fixing the issues:

1. Run the EAS build command: `npx eas build --platform android --profile preview`
2. Install the app on your device
3. Test notifications using the `checkNotificationsModule()` function

Good luck! If issues persist, please share any specific error messages from the EAS build log.
