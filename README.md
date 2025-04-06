npx expo prebuild

### Deploy บน Expo สำหรับแชร์โปรเจค

```bash
eas update --branch main --message "Deploy"
```

### Build Android

```bash
npx eas build --platform android --profile preview
```

### Build IOS

```bash
npx eas build --platform ios --profile ios-simulator
```
