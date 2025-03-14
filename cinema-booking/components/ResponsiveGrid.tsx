import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

interface ResponsiveGridProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  numColumns: number;
  spacing: number;
  contentContainerStyle?: object;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  data,
  renderItem,
  numColumns,
  spacing,
  contentContainerStyle,
}) => {
  // Group items into rows
  const rows = [];
  for (let i = 0; i < data.length; i += numColumns) {
    rows.push(data.slice(i, i + numColumns));
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((item, index) => (
            <View
              key={`item-${index}`}
              style={{
                // Equal width for all items
                width: `${100 / numColumns}%`,
                // Apply padding to create spacing
                paddingLeft: index === 0 ? 0 : spacing / 2,
                paddingRight: index === row.length - 1 ? 0 : spacing / 2,
                marginBottom: spacing,
              }}
            >
              {renderItem(item, rowIndex * numColumns + index)}
            </View>
          ))}

          {/* Add empty views to fill the last row if needed */}
          {row.length < numColumns &&
            [...Array(numColumns - row.length)].map((_, index) => (
              <View
                key={`empty-${index}`}
                style={{ width: `${100 / numColumns}%` }}
              />
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
