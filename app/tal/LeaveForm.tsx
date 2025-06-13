import CustomBackground from "@/components/CustomBackground";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import CustomTopBar from "@/components/CustomTopBar";
import Modal from "@/components/Modal";
import { RootState } from "@/core/store";
import { theme } from "@/core/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";

const router = useRouter();

const data = [
    {label: 'มานิต', value: '1'},
    {label: 'ณัฐดนัย', value: '2'},
    {label: 'ฮากิม', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
];

const LeaveForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [leavetype, setLeavetype] = useState([]);// ประเภทการลา
  const [leavesubstitute, setLeavesubstitute] = useState([]);//ผู้รับมอบงาน
  const [loading, setLoading] = useState(true);
  const [isFocusLeavetype, setIsFocusLeavetype] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [reason, setReason] = useState(null);
  const [round, setRount] = React.useState('3');

  const _renderItem2 = item => {
      return (
      <View style={styles.item}>
          <CustomText style={styles.textItem}>{item.label}</CustomText>
      </View>
      );
  };

  const _renderItem = item => {
      return (
      <View style={styles.item}>
          <CustomText style={styles.textItem}>{item.label}</CustomText>
      </View>
      );
  };

  // const _renderItem = item => {
  //     return (
  //     <View style={styles.item}>
  //         <CustomText style={styles.textItem}>{item.timeCheckin}</CustomText>
  //     </View>
  //     );
  // };
  
  useEffect(() => {
    if (loading == true) {
      //initSelectMonth();
      fetch(
        `https://apisprd.wu.ac.th/tal/tal-leave-reg/${user.person_id}/createLeave`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            setLeavetype(data.dtLeaveType);
            setLeavesubstitute(data.dtLeaveSubstitute);
            setLoading(false);
          }
        });
    }
  }, [loading]);

  return (
    <CustomBackground>
      {/* Top bar session */}
      <CustomTopBar 
        title="บันทึกการลา" 
        back={() => router.push("/tal/Leave")}
      />

      <View style={styles.container}>
        <CustomText>ประเภทการลา</CustomText>
        <Dropdown
          style={[styles.dropdown, isFocusLeavetype && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={leavetype}
          search
          maxHeight={300}
          searchPlaceholder="Search..."
          labelField="label"
          valueField="value"
          placeholder={isFocusLeavetype ? '...' : 'กรุณาเลือกประเภทการลา'}
          value={value}
          onFocus={() => setIsFocusLeavetype(true)}
          onBlur={() => setIsFocusLeavetype(false)}
          onChange={item => {
            // setValue(item.value);
            setIsFocusLeavetype(false);
            console.log('selected', item.leaveDaybefore);
          }}
          renderLeftIcon={() => (
              <Image style={styles.icon} source={require('../../assets/images/camera.png')} />
          )}
          renderItem={item => _renderItem(item)}
        />

        <CustomText>ผู้รับมอบงาน</CustomText>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={leavesubstitute}
          search
          maxHeight={300}
          searchPlaceholder="Search..."
          labelField="label"
          valueField="value"
          placeholder={isFocus ? '...' : 'กรุณาเลือกผู้รับมอบงาน'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            // setValue(item.value);
            // setIsFocus(false);
            console.log('selected', item.value);
          }}
          renderLeftIcon={() => (
              <Image style={styles.icon} source={require('../../assets/images/camera.png')} />
          )}
          renderItem={item => _renderItem(item)}
        />

        <SegmentedButtons
          value={round}
          onValueChange={setRount}
          buttons={[
            {
              value: '1',
              label: 'ครึ่งวันเช้า',
            },
            {
              value: '2',
              label: 'ครั้งวันบ่าย',
            },
            { value: '3', 
              label: 'ทั้งวัน' },
          ]}
        />

        <CustomText>เหตุผล</CustomText>
        <CustomTextInput multiline={true} numberOfLines={4}></CustomTextInput>
        <View style={styles.inputCont}>
          <TextInput 
            multiline={true} 
            numberOfLines={4} 
            style={styles.input} 
            underlineColor="transparent"
            value={reason}
            onChangeText={(text: string) => 
              setReason(text)
            }
          />
        </View>
        

        <Button icon="camera" mode="contained" onPress={() => setModalVisible(true)}>
          บันทึก
        </Button>

        <Modal
          visible={modalVisible}
          title={"บันทึกการลา"}
          description={"คุณต้องการบันทึกการลาใช่หรือไม่?"}
          hideModal={() => {
            setModalVisible(false);
          }}
          accept={async () => {
            // // await signOut();
            // //ลบการลงทะเบียนใช้งาน Thasala Application
            // const expoToken = await registerForPushNotifications();
            // const osname = await Device.osName;
            // //console.log("Expo Push Token:", expoToken);
            // const formData = new FormData();
            // formData.append("personId", user?.person_id);
            // formData.append("expoToken", expoToken ?? "");
            // formData.append("osname", osname ?? "");

            // try {
            //   const response = await fetch(
            //     "http://10.250.2.9/apis/mbl/mbl-register/deleteRegister",
            //     {
            //       method: "POST",
            //       body: formData,
            //     }
            //   );

            //   const result = await response.json();
            //   if (result.code === 200) {
            //     //console.error("Success:");
            //   }
            // } catch (error) {
            //   // console.error("Submit Error:", error);
            //   // alert("เกิดข้อผิดพลาดขณะส่งข้อมูล");
            // }

            // dispatch(logout());
            // setModalVisible(false);
            router.back();
            console.log(reason);
          }}
          acceptText={"ตกลง"}
          cancelText={"ยกเลิก"}
        />
      </View>
    </CustomBackground>
  )
}

export default LeaveForm

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 16,
      alignContent: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  placeholderStyle: {
    color: 'gray',
  },
  icon: {
      marginRight: 5,
      width: 18,
      height: 18,
  },
  item: {
      paddingVertical: 17,
      paddingHorizontal: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  selectedTextStyle: {
      color: 'black',
  },
  inputCont:{
    width: "100%",
    marginVertical: 5,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: "red"
  },
});