import { defineConfig } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config" // สำคัญมาก: นำเข้าค่าเริ่มต้นของ shadcn/ui

export default defineConfig({
  // รวมค่าเริ่มต้นของ shadcn/ui เข้ากับการตั้งค่าของคุณ
  ...defaultConfig,
  content: [
    // ตรวจสอบให้แน่ใจว่าพาธเหล่านี้ครอบคลุมไฟล์ทั้งหมดที่ใช้ Tailwind CSS
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}", // เพิ่ม lib เพื่อความสมบูรณ์
    // หากมีไฟล์อื่นๆ ที่ใช้คลาส Tailwind ให้เพิ่มที่นี่
  ],
  theme: {
    extend: {
      // เก็บสีเริ่มต้นของ shadcn/ui ไว้
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors, // กระจายสีเริ่มต้นของ shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // สีแบรนด์ของคุณ
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // สีส้มหลัก
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    ...defaultConfig.plugins, // กระจายปลั๊กอินเริ่มต้นของ shadcn/ui
    require("tailwindcss-animate"),
  ],
})
