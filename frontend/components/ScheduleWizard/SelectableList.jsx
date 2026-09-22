import { TouchableOpacity, View } from "react-native";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";

export default function SelectableList({
  items = [],
  selectedId,
  onSelect,
  renderItem,
}) {
    const { colors } = useTheme();
    const style = createScheduleStyles(colors); 
    
  if (!items.length) return null;

  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            style.selectableItem,
            selectedId === item.id && style.selectedItem,
          ]}
          onPress={() => onSelect(item.id)}
          accessibilityRole="button"
        >
          <View>{renderItem(item)}</View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
