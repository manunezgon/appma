import { StyleSheet, TouchableOpacity, View } from "react-native";

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
          style={[styles.item, selectedId === item.id && styles.selectedItem]}
          onPress={() => onSelect(item.id)}
          accessibilityRole="button"
        >
          <View>{renderItem(item)}</View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#1976D2",
  },
  selectedItem: {
    backgroundColor: "#4CAF50",
  },
});
