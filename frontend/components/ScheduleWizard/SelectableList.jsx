import { TouchableOpacity, View } from "react-native";
import style from "../../Styles/ScheduleStyles.jsx";

export default function SelectableList({
  items = [],
  selectedId,
  onSelect,
  renderItem,
}) {
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
