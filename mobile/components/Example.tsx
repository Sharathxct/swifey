import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Text } from '~/components/ui/text';
import { Cloud } from '~/lib/icons/Cloud';
import { Github } from '~/lib/icons/Github';
import { LifeBuoy } from '~/lib/icons/LifeBuoy';
import { LogOut } from '~/lib/icons/LogOut';

export default function DropdownMenuScreen() {
  const triggerRef = React.useRef<React.ElementRef<typeof DropdownMenuTrigger>>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <View className='flex-1 justify-center items-center p-6 gap-12'>
      <Pressable
        className='absolute top-0 right-0 w-16 h-16 active:bg-primary/5'
        onPress={() => {
          // open menu programmatically
          triggerRef.current?.open();
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger ref={triggerRef} asChild>
          <Button variant='outline'>
            <Text>Open</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent insets={contentInsets} className='w-64 native:w-72'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubContent>
                <Animated.View entering={FadeIn.duration(200)}>
                  <DropdownMenuSeparator />
                </Animated.View>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Github className='text-foreground' size={14} />
            <Text>GitHub</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className='text-foreground' size={14} />
            <Text>Support</Text>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud className='text-foreground' size={14} />
            <Text>API</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className='text-foreground' size={14} />
            <Text>Log out</Text>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
