import React, { createContext, useContext, useState, useRef } from "react";
import { Animated, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = height * 0.08;

type TabBarVisibilityContextType = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  translateY: Animated.Value;
  opacity: Animated.Value;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType>({
  visible: true,
  setVisible: () => {},
  translateY: new Animated.Value(0),
  opacity: new Animated.Value(1),
});

export const TabBarVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleVisibilityChange = (isVisible: boolean) => {
    // Don't animate if already in the desired state
    if ((isVisible && visible) || (!isVisible && !visible)) {
      return;
    }

    setVisible(isVisible);

    // Use parallel animations for translate and opacity
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: isVisible ? 0 : TAB_BAR_HEIGHT,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <TabBarVisibilityContext.Provider
      value={{
        visible,
        setVisible: handleVisibilityChange,
        translateY,
        opacity,
      }}
    >
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);