import React, {forwardRef, ReactNode, Ref} from "react";
import { BInput } from "@tipster/next/components/bento/BInput";
import { Search } from '@tamagui/lucide-icons';
import { Spinner } from 'tamagui';
import type { InputProps } from 'tamagui';

interface AutoCompleteInputProps extends InputProps {
  ref: Ref<HTMLInputElement>;
  loading?: boolean;
  label?: string;
  icon?: ReactNode,
  placeholder?: string,
  onLayout: () => void,
  onPress: () => void,
}

const AutoCompleteInput = forwardRef(
  (props: AutoCompleteInputProps, ref
) => {
  const {
    onLayout,
    loading = false,
    label,
    placeholder = 'Search...',
    icon = <Search paddingRight={0} />,
    ...otherProps
  } = props;

  return (
    <BInput
      onLayout={onLayout}
      ref={ref}
    >
      {label && <BInput.Label>{label}</BInput.Label>}

      <BInput.Box>
        <BInput.Icon paddingRight={0}>
          {loading ? <Spinner /> : icon}
        </BInput.Icon>

        <BInput.Area
          paddingRight={0}
          flexShrink={0}
          placeholder={placeholder}
          {...otherProps}
        />
      </BInput.Box>
    </BInput>
  )
});

AutoCompleteInput.displayName = 'AutoCompleteInput';

export default AutoCompleteInput;
