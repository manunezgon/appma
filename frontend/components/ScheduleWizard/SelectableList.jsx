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
      {items.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            style={[style.selectableItem, isSelected && style.selectedItem]}
            onPress={() => onSelect(item.id)}
            accessibilityRole="button"
          >
            <View>{renderItem(item, isSelected)}</View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
