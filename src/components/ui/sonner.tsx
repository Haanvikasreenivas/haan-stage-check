
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useAnimations } from "@/contexts/AnimationContext";

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const { animationsEnabled } = useAnimations();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        duration: animationsEnabled ? 2000 : 3000, // Longer duration when animations are disabled
        className: animationsEnabled ? "animate-fade-in" : "",
      }}
      {...props}
    />
  )
}

export { Toaster }
