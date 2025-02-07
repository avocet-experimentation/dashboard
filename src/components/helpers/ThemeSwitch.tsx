import { Sun, Moon } from 'lucide-react';
import { useColorMode } from '#/components/ui/color-mode';
import { Switch } from '#/components/ui/switch';

export default function ThemeSwitch() {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  return (
    <Switch
      size="lg"
      thumbLabel={{
        on: <Moon size={18} />,
        off: <Sun color="#000000" size={18} />,
      }}
      onCheckedChange={(e) => {
        const theme = e.checked ? 'dark' : 'light';
        setColorMode(theme);
      }}
    />
  );
}
