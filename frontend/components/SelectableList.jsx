import { TouchableOpacity, View } from "react-native";

export default function SelectableList({
  items,
  selectedId,
  onSelect,
  renderItem,
}) {
  return items.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={{
        padding: 10,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: selectedId === item.id ? "#4CAF50" : "#1976D2",
      }}
      onPress={() => onSelect(item.id)}
    >
      <View>{renderItem(item)}</View>
    </TouchableOpacity>
  ));
}
