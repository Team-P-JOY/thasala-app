export const dataValidator = (data: string, text: string) => {
  if (!data || data.length <= 0) return `${text}ข้อมูลต้องไม่ว่าง`;

  return "";
};

export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Email cannot be empty.";
  if (!re.test(email)) return "Ooops! We need a valid email address.";

  return "";
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return "Password cannot be empty.";

  return "";
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return "Name cannot be empty.";

  return "";
};

export const getDatetext = (xDate: string, xLang: string, xSize: string) => {
  if (xDate) {
    var iDate = new Date(xDate);
    var y1 = <any>0;
    var m1 = iDate.getMonth();
    var d1 = iDate.getDate() + "";
    var A1 = <any>[];
    if (xLang == "th") {
      if (xSize == "l") {
        A1 = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];
      } else if (xSize == "s") {
        A1 = [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค",
          "พ.ย.",
          "ธ.ค.",
        ];
      }
      y1 = iDate.getFullYear() + 543 + "";
    } else if (xLang == "en") {
      if (xSize == "l") {
        A1 = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
      } else if (xSize == "s") {
        A1 = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      }
      y1 = iDate.getFullYear() + "";
    }
    return d1 + " " + A1[m1] + " " + y1;
    //return iDate;
  }

  return "";
};

export const ApiUrl = "https://apisprd.wu.ac.th";
