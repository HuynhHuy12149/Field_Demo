"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  labels: Record<string, string>;
  registerItem: (value: string, label: string) => void;
}>({
  labels: {},
  registerItem: () => {},
});

const Select = ({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) => {
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const registerItem = React.useCallback((val: string, label: string) => {
    setLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, labels, registerItem }}>
      <DropdownMenu>
        {children}
      </DropdownMenu>
    </SelectContext.Provider>
  )
}

const SelectGroup = DropdownMenuGroup;

const SelectValue = ({ placeholder, className }: { placeholder?: string, className?: string }) => {
  const { value, labels } = React.useContext(SelectContext);
  const display = (value !== undefined && labels[value]) ? labels[value] : placeholder;
  return (
    <span className={cn("flex-1 text-left truncate", className)}>
      {display}
    </span>
  );
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuTrigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:border-slate-700",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon className="h-4 w-4 opacity-50" />
  </DropdownMenuTrigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, children, align = "start", sideOffset = 4, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn("w-(--anchor-width)", className)}
    {...props}
  >
    {children}
  </DropdownMenuContent>
))
SelectContent.displayName = "SelectContent"

const SelectLabel = DropdownMenuLabel;
const SelectSeparator = DropdownMenuSeparator;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: selectedValue, onValueChange, registerItem } = React.useContext(SelectContext);
  
  React.useEffect(() => {
    if (typeof children === 'string') {
      registerItem(value, children);
    } else if (Array.isArray(children)) {
       const text = children.filter(c => typeof c === 'string').join('');
       if (text) registerItem(value, text);
    }
  }, [value, children, registerItem]);

  const isSelected = selectedValue === value;

  return (
    <DropdownMenuItem
      ref={ref}
      className={cn("flex w-full cursor-pointer items-center justify-between py-2", className)}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      {isSelected && (
        <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
      )}
    </DropdownMenuItem>
  )
})
SelectItem.displayName = "SelectItem"

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
