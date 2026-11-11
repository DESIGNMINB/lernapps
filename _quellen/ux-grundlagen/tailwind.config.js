/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './*.{ts,tsx}',
        './services/**/*.{ts,tsx}',
        './utils/**/*.{ts,tsx}',
        "./index.html",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                // Überschriften (font-serif) ebenfalls in IBM Plex Sans, wie in allen Lern-Apps
                serif: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            colors: {
                // IWI-/HKA-Design wie in der Typografie-App: Violett statt Orange
                orange: {
                    50: '#F1EEF4', 100: '#E6DCEF', 200: '#C8A8DE', 300: '#B08BCF', 400: '#9254D1',
                    500: '#7A45AE', 600: '#64378C', 700: '#5A2576', 800: '#4A1F61', 900: '#3B194D', 950: '#2A1138',
                },
                // Buttons im Inhaltsbereich: Orange, abgedunkelt für ≥ 4,5:1 mit weißer Schrift (WCAG 1.4.3)
                cta: { DEFAULT: '#CC4E00', hover: '#4B5563' },
                // Neutrale Grautöne wie in der Typografie-App
                stone: {
                    // 400/500 abgedunkelt: Text erreicht ≥ 4,5:1 auf Weiß und stone-50/100 (WCAG 1.4.3)
                    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#636A77',
                    500: '#5B6270', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827', 950: '#030712',
                },
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
