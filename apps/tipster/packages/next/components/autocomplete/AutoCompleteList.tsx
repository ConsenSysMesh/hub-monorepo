import React, { useState } from "react";
import { YStack, Button } from 'tamagui';
import { X } from "@tamagui/lucide-icons";
import type { Item, SearchFunction } from "@tipster/next/components/autocomplete/AutoComplete";
import AutoComplete, {FilterFunction} from "@tipster/next/components/autocomplete/AutoComplete";
import AutoCompleteItem from "@tipster/next/components/autocomplete/AutoCompleteItem";
import { BInput } from "@tipster/next/components/bento/BInput";
import AutoCompleteConfirm, { ConfirmProps } from "@tipster/next/components/autocomplete/AutoCompleteConfirm";

interface ShouldConfirmProps {
  confirm: ConfirmProps;
}

interface AutoCompleteListProps {
  onChange: (items: Item[]) => void;
  onShouldRemove?: (item: Item) => ShouldConfirmProps | boolean;
  onBlur: () => void;
  value: Item[];
  placeholder?: string,
  searchFunc: SearchFunction;
  filterFunc?: FilterFunction;
  label?: string,
  requireValue?: boolean,
}

const isShouldConfirmProps = (value: any): value is ShouldConfirmProps => {
  return value && typeof value === 'object' && 'confirm' in value;
};

const AutoCompleteList: React.FC<AutoCompleteListProps> = (props) => {
  const {
    onChange = () => {},
    onShouldRemove = () => true,
    value = [],
    label,
    placeholder = 'Add Item',
    requireValue = false,
    ...otherProps
  } = props;

  const defaultValue = requireValue && value.length === 1 ? [{ ...value[0], disabled: true }] : value;

  const [items, setItems] = useState<Item[]>(defaultValue);
  const [currentItem, setCurrentItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean | ConfirmProps>(false);

  const addItem = (item: Item) => {
    const doesItemExist = items
      .some((existingItem) => existingItem.id === item.id);

    let updatedItems = [...items, item];

    if (updatedItems.length > 1) {
      updatedItems = updatedItems.map(itm => ({ ...itm, disabled: false }));
    }

    if (!doesItemExist) {
      setItems(updatedItems);
    }

    onChange(updatedItems);
  }

  const processRemoveItem = (item: Item) => {
    const shouldRemove = onShouldRemove(item);

    if (isShouldConfirmProps(shouldRemove)) {
      setCurrentItem(item);
      setConfirmOpen(shouldRemove.confirm);
    } else if (shouldRemove) {
      removeItem(item);
    }
  }

  const removeItem = (item: Item) => {
    let updatedItems = items.filter(itm => itm.id !== item.id);

    if (requireValue && updatedItems.length === 1) {
      updatedItems = [
        {
          ...updatedItems[0],
          disabled: true,
        }
      ]
    }

    setItems(updatedItems);
    onChange(updatedItems);
  };

  const closeConfirm = () => {
    setConfirmOpen(false)
    setCurrentItem(null);
  };

  return (
    <YStack>
      {label && <BInput.Label marginBottom="$2">{label}</BInput.Label>}

      <AutoComplete
        onChange={addItem}
        placeholder={placeholder}
        {...otherProps}
      />

      <YStack marginTop="$3" gap="$3">
        {items.map((item, index) => (
          <AutoCompleteItem
            key={item?.id || index}
            item={item}
            iconAfter={!item.disabled ?
              <Button
                icon={X}
                chromeless
                onPress={() => processRemoveItem(item)}
              /> : null
            }
            scaleIcon={2}
            borderRadius="$4"
            borderColor="$color6"
            borderWidth="0.5px"
            hoverTheme={false}
            backgroundColor={item.disabled ? '$color2' : undefined}
          />
        ))}
      </YStack>

      <AutoCompleteConfirm
        open={!!confirmOpen}
        onCancel={closeConfirm}
        onRemove={()=> {
          removeItem(currentItem);
          closeConfirm();
        }}
        {...(confirmOpen && typeof confirmOpen === 'object' ? confirmOpen : {})}
      />
    </YStack>
  );
};

export default AutoCompleteList;
