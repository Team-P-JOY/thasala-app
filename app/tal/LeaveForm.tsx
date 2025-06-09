import CustomBackground from "@/components/CustomBackground";
import CustomFooterBar from "@/components/CustomFooterBar";
import CustomText from "@/components/CustomText";
import CustomTopBar from "@/components/CustomTopBar";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

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
  // const [data, setData] = useState([]);// ข้อมูลการลงเวลางาน
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

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
        `https://apisprd.wu.ac.th/tal/tal-timework/get-schedule-detail?personId=6500000061&date=2025-06-05&shiftId=304`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          if (data.code === 200) {
            //setData(data.dtTimestamp);
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
        <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            search
            maxHeight={300}
            searchPlaceholder="Search..."
            labelField="label"
            valueField="value"
            placeholder={isFocus ? '...' : 'กรุณาเลือกชื่อ'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
              console.log('selected', item.value);
            }}
            renderLeftIcon={() => (
                <Image style={styles.icon} source={require('../../assets/images/camera.png')} />
            )}
            renderItem={item => _renderItem(item)}
        />
      </View>
      
      {/* Footer session */}
      <CustomFooterBar />
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
});