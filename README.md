# Mobile Application สำหรับบุคลากร

## รายละเอียดโครงการ

ระบบ Mobile Application สำหรับบุคลากรนี้ถูกออกแบบมาเพื่อเพิ่มประสิทธิภาพการทำงานและการสื่อสารภายในองค์กร โดยรองรับการใช้งานบนระบบปฏิบัติการ **iOS** และ **Android**

## ฟีเจอร์หลัก

- **ระบบเช็คอิน-เช็คเอาท์**
  - รองรับการเช็คอินผ่าน GPS และกล้องถ่ายรูป
  - ตรวจสอบตำแหน่งของจุดเช็คอินที่กำหนด
  - บันทึกข้อมูลวันที่ เวลา และพิกัดที่เช็คอิน-เช็คเอาท์
- **การแจ้งเตือน (Push Notification)**
  - แจ้งเตือนข่าวสารภายในองค์กร
  - สามารถตั้งค่าการแจ้งเตือนเฉพาะบุคคลได้
- **ระบบการเข้าสู่ระบบ**
  - รองรับการล็อกอินด้วย **WU PASS**
  - รองรับการเข้าสู่ระบบด้วย **PIN** ที่ตั้งค่าไว้
  - ระบบความปลอดภัยในการเข้าถึงข้อมูล

## เทคโนโลยีที่ใช้

- **Frontend:** React Native
- **Backend:** Express.js
- **Database:** Oracle
- **API Gateway:** Kong
- **Authentication:** LDAP

## Workflows

### การเข้าสู่ระบบ

1. ผู้ใช้ล็อกอินด้วย **WU PASS**
2. หากล็อกอินสำเร็จ ระบบจะตรวจสอบว่าผู้ใช้เคยตั้งค่า **PIN** หรือไม่
3. ถ้าเคยตั้งค่า PIN ระบบจะนำไปที่หน้า PIN Login
4. หากไม่เคย ระบบจะพาไปตั้งค่า PIN ก่อนเข้าสู่ระบบ

### การเช็คอิน-เช็คเอาท์

1. ผู้ใช้เปิดแอปแล้วไปที่หน้า **เช็คอิน**
2. ระบบแสดงแผนที่พร้อมระยะห่างจากจุดเช็คอิน
3. กดปุ่ม **เช็คอิน** หรือ **เช็คเอาท์** และบันทึกภาพหลักฐาน
4. ระบบบันทึกข้อมูลเวลาและพิกัดลงฐานข้อมูล

## ข้อจำกัดของระบบ

- GPS อาจไม่ทำงานในบางพื้นที่ที่ไม่มีสัญญาณอินเทอร์เน็ต
- Push Notification อาจมีความล่าช้าขึ้นอยู่กับเครือข่ายของผู้ใช้

## แผนการพัฒนา

| ระยะเวลา | รายละเอียด           |
| -------- | -------------------- |
| 1 เดือน  | วิเคราะห์ระบบ        |
| 3 เดือน  | พัฒนาและทดสอบ        |
| 1 เดือน  | นำระบบขึ้นใช้งานจริง |

### Build Andriod

```bash
npx expo prebuild
```

### Deploy บน Expo สำหรับแชร์โปรเจค

```bash
npx eas update --branch main --message "Deploy"
```

### Build Android

```bash
npx eas build --platform android --profile preview
```

### Build IOS

```bash
npx eas build --platform ios --profile ios-simulator
```

## 👨‍💻 **ทีมพัฒนา (Development Team)**

| รูปโปรไฟล์                                                               | ชื่อ                                            |
| ------------------------------------------------------------------------ | ----------------------------------------------- |
| <img src="https://github.com/sthongchan27.png" width="70" height="70" /> | [sthongchan27](https://github.com/sthongchan27) |
| <img src="https://github.com/kimookpong.png" width="70" height="70" />   | [kimookpong](https://github.com/kimookpong)     |
| <img src="https://github.com/manitgithub.png" width="70" height="70" />  | [manitgithub](https://github.com/manitgithub)   |
| <img src="https://github.com/natdanaisu.png" width="70" height="70" />   | [natdanaisu](https://github.com/natdanaisu)     |
| <img src="https://github.com/Yapaka51.png" width="70" height="70" />     | [Yapaka51](https://github.com/Yapaka51)         |
