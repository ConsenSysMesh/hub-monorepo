import {
  Adapt,
  Popover,
  YStack,
  ListItem,
  Sheet,
  useMedia,
  Button,
} from 'tamagui';
import React, {useState, useRef, ReactNode, useMemo, useCallback} from "react";
import AutoCompleteInput from "@tipster/next/components/autocomplete/AutoCompleteInput";
import { useDebouncedCallback } from 'use-debounce';
import AutoCompleteItem from "@tipster/next/components/autocomplete/AutoCompleteItem";

const SEARCH_CHAR_LIMIT = 2;
const SEARCH_DELAY = 200;
const FILTER_FUNC = (item: Item, index: number, term: string) =>
  item.title.toLowerCase().includes(term.toLowerCase());
const CLOSE_DELAY = 200;

export interface Item {
  id?: string;
  title: string;
  subTitle?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SearchFunction {
  (term: string): Promise<Item[]>;
}

export interface FilterFunction {
  (item: Item, index: number, term: string): boolean;
}

export interface AutoCompleteProps {
  value?: Item[];
  searchFunc?: SearchFunction;
  filterFunc?: FilterFunction;
  onChange?: (item: Item) => void;
  onBlur?: () => void;
  clear?: boolean;

  // input props
  label?: string;
  icon?: ReactNode,
  placeholder?: string,
}

export const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const {
    value: items = [],
    searchFunc= () => {},
    filterFunc = FILTER_FUNC,
    onChange = () => {},
    onBlur = () => {},
    clear = false,
    ...inputProps
  } = props;

  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const [searchItems, setSearchItems] = useState<Item[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const search = async (term: string) => {
    const shouldSearch = term.length > SEARCH_CHAR_LIMIT;

    if (shouldSearch && searchFunc) {
      setIsSearching(true);
      const results = await searchFunc(term) || [];
      const combinedItems = [...items, ...results];

      // filter results
      const uniqueItems = new Map();
      combinedItems.forEach(item => {
        // Use id if available, otherwise fall back to name
        const key = item.id !== undefined ? item.id : item.title;
        uniqueItems.set(key, item);
      });

      setSearchItems(Array.from(uniqueItems.values())
        .filter((item, index) => filterFunc(item, index, searchValue)));
      setIsSearching(false);
    } else {
      setSearchItems(items);
    }
  };

  const debouncedSearch = useDebouncedCallback(search, SEARCH_DELAY);

  const { sm } = useMedia();

  const openPopover = () => {
    setOpen(true)
  };

  const closePopover = useCallback(() => {
    // Note: this has to wait until the ListItem press event can fire
    if (!sm) {
      setTimeout(() => setOpen(false), CLOSE_DELAY);
    }

    onBlur();
  }, [onBlur, sm]);

  const onInputWidthChange = () => {
    // timeout needed or initial measurement is off
    // something to do with the way onLayout fires
    setTimeout(() => {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.measure((x: number, y: number, w: number) => {
          setInputWidth(w);
        });
      }
    }, 100);
  };

  const onSearchChange = useCallback((term: string) => {
    setSearchValue(term);
    debouncedSearch(term);
    setOpen(true);
  }, [debouncedSearch]);

  const onItemPress = (item: Item) => {
    setSearchValue('');
    setSearchItems([]);
    onChange(item);
    if (sm) setOpen(false);
  };

  const input = useMemo(() => (
    <AutoCompleteInput
      value={searchValue}
      ref={inputRef}
      onPress={openPopover}
      onBlur={closePopover}
      onChangeText={onSearchChange}
      onLayout={onInputWidthChange}
      loading={isSearching}
      {...inputProps}
    />
  ), [closePopover, inputProps, isSearching, onSearchChange, searchValue]);

  return (
    <Popover
      size="$1"
      allowFlip
      open={open}
      offset={0}
      {...props}
    >
      <Popover.Trigger>
        {sm ?
          <Button
            onPress={openPopover}
            variant="outlined"
            backgroundColor="$color2"
            borderColor="$color3"
            justifyContent="flex-start"
            color="$color9"
          >
            {inputProps.placeholder}
          </Button> :
          input
        }
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom onOpenChange={setOpen} snapPoints={[91]}>
          <Sheet.Frame>
            {input}

            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>

          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Popover.Content
        trapFocus={false}
        disableFocusScope

        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow />
        <Popover.ScrollView>
          <YStack maxHeight="300px" width={`${inputWidth}px`}>
            {searchItems.map((item, i) => (
              <AutoCompleteItem
                item={item}
                onChange={() => onItemPress(item)}
                key={item?.id || item?.title.toLowerCase() || i}
              />
            ))}

            {searchItems.length === 0 && !isSearching && (
              <ListItem title="No results found..." />
            )}
          </YStack>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  );
}

export default AutoComplete;
