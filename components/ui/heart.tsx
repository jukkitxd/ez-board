import * as React from "react"
import { LucideHeart } from "lucide-react"

const Heart = React.forwardRef<
  React.ElementRef<typeof LucideHeart>,
  React.ComponentPropsWithoutRef<typeof LucideHeart>
>(({ className, ...props }, ref) => <LucideHeart ref={ref} className="inline-block h-4 w-4" {...props} />)
Heart.displayName = "Heart"

export default Heart
