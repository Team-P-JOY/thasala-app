import { theme } from "@/core/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native-paper";
import CustomText from "./CustomText";

interface MonthOption {
  label: string;
  value: string;
}

interface MonthYearPickerProps {
  visible: boolean;
  onDismiss: () => void;
  options: MonthOption[];
  currentValue: string;
  onSelect: (value: string) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  onDismiss,
  options,
  currentValue,
  onSelect,
}) => {
  // Extract unique months and years from options
  const { months, years } = useMemo(() => {
    const monthsSet = new Set<string>();
    const yearsSet = new Set<string>();

    options.forEach((option) => {
      const parts = option.label.split(" ");
      if (parts[0]) monthsSet.add(parts[0]);
      if (parts[1]) yearsSet.add(parts[1]);
    });

    return {
      months: Array.from(monthsSet),
      years: Array.from(yearsSet),
    };
  }, [options]);

  // Get current selected month and year
  const currentSelection = useMemo(() => {
    const currentOption = options.find((opt) => opt.value === currentValue);
    if (!currentOption) return { month: "", year: "" };

    const parts = currentOption.label.split(" ");
    return {
      month: parts[0] || "",
      year: parts[1] || "",
    };
  }, [options, currentValue]);

  // Handle month selection
  const handleMonthSelect = (monthName: string) => {
    // Find an item with this month name that matches the current year
    const matchingItem = options.find(
      (m) =>
        m.label.includes(monthName) && m.label.includes(currentSelection.year)
    );

    if (matchingItem) {
      onSelect(matchingItem.value);
      onDismiss();
    }
  };

  // Handle year selection
  const handleYearSelect = (year: string) => {
    // Find an item with this year that matches the current month
    const matchingItem = options.find(
      (m) => m.label.includes(year) && m.label.includes(currentSelection.month)
    );

    if (matchingItem) {
      onSelect(matchingItem.value);
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.modalHeader}>
        <CustomText bold style={styles.modalTitle}>
          เลือกเดือน
        </CustomText>
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.datePickerContainer}>
        {/* Month Picker Column */}
        <View style={styles.pickerColumn}>
          <View style={styles.pickerColumnHeader}>
            <CustomText style={styles.pickerColumnHeaderText}>เดือน</CustomText>
          </View>

          <ScrollView
            style={styles.pickerScrollView}
            showsVerticalScrollIndicator={false}
          >
            {months.map((monthName, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pickerItem,
                  currentSelection.month === monthName
                    ? styles.selectedPickerItem
                    : null,
                ]}
                onPress={() => handleMonthSelect(monthName)}
              >
                <CustomText
                  style={[
                    styles.pickerItemText,
                    currentSelection.month === monthName
                      ? styles.selectedPickerItemText
                      : null,
                  ]}
                  bold={currentSelection.month === monthName}
                >
                  {monthName}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Year Picker Column */}
        <View style={styles.pickerColumn}>
          <View style={styles.pickerColumnHeader}>
            <CustomText style={styles.pickerColumnHeaderText}>ปี</CustomText>
          </View>

          <ScrollView
            style={styles.pickerScrollView}
            showsVerticalScrollIndicator={false}
          >
            {years.map((year, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.pickerItem,
                  currentSelection.year === year
                    ? styles.selectedPickerItem
                    : null,
                ]}
                onPress={() => handleYearSelect(year)}
              >
                <CustomText
                  style={[
                    styles.pickerItemText,
                    currentSelection.year === year
                      ? styles.selectedPickerItemText
                      : null,
                  ]}
                  bold={currentSelection.year === year}
                >
                  {year}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: "80%",
    alignSelf: "center",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 250,
  },
  pickerColumnHeader: {
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  pickerColumnHeaderText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  pickerScrollView: {
    width: "100%",
    paddingHorizontal: 10,
  },
  pickerItem: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedPickerItem: {
    backgroundColor: theme.colors.primary,
  },
  pickerItemText: {
    fontSize: 18,
    color: "#333",
  },
  selectedPickerItemText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MonthYearPicker;
