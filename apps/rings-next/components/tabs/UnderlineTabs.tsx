import { useState } from 'react'
import type { TabLayout, TabsTabProps } from 'tamagui'
import {
  AnimatePresence,
  SizableText,
  Tabs,
  YStack,
  View,
  TabsProps,
} from 'tamagui'
import TabsRovingIndicator from "@farcaster/rings-next/components/tabs/TabsRovingIndicator";

export interface Tab {
  key: string;
  name: string;
  icon?: React.ReactNode;
}

interface UnderlineTabsProps extends TabsProps {
  tabs: Tab[],
  onTabPress?: (tab: Tab) => void,
  defaultTab?: string,
}

const UnderlineTabs: React.FC<UnderlineTabsProps> = (props) => {
  const {
    tabs = [],
    onTabPress = () => {},
    defaultTab = tabs[0].key,
    ...otherProps
  } = props;

  const [tabState, setTabState] = useState<{
    currentTab: string
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,
    currentTab: defaultTab,
    intentAt: null,
    prevActiveAt: null,
  })

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt: any) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt: any) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

  // 1 = right, 0 = nowhere, -1 = left
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1
  })()

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      flexDirection="column"
      activationMode="manual"
      {...otherProps}
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              active
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
        >
          {tabs.map(tab => (
            <Tabs.Tab
              unstyled
              paddingHorizontal="$3"
              paddingVertical="$2"
              value={tab.key}
              key={tab.key}
              onInteraction={handleOnInteraction}
              onPress={() => onTabPress(tab)}
            >
              {tab?.icon &&
                <View  marginRight="$2">
                  {tab.icon}
                </View>
              }
              <SizableText>{tab.name}</SizableText>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>
    </Tabs>
  )
}

export default UnderlineTabs;