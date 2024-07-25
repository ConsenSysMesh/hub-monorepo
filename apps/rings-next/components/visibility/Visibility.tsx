import React from "react";
import { View, ViewProps } from "tamagui";

interface VisibilityProps extends ViewProps {
  visible: boolean;
  children: React.ReactNode;
}

const Visibility: React.FC<VisibilityProps> = (props) => {
  const {
    visible = false,
    children,
  } = props;

  return (
    <View style={visible ? {} : { display: 'none' }} {...props}>
      {children}
    </View>
  );
}

export default Visibility;
