
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Playfair Display', 'serif'],
				purepix: ['Quicksand', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Colores personalizados
				'naranja': '#FF6B35',
				'rojo': '#C1292E',
				'amarillo': '#FDCA40',
				'verde': '#6BAA75',
				'azul': '#235789',
				// Colores PurePix
				'purepix-primary': '#9b87f5',
				'purepix-secondary': '#7E69AB',
				'purepix-tertiary': '#6E59A5',
				'purepix-light': '#D6BCFA',
				'purepix-vivid': '#8B5CF6',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.85', transform: 'scale(1.05)' }
				},
				'heartbeat': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.08)', opacity: '0.9' }
				},
				'ripple': {
					'0%': { transform: 'scale(0.95)', opacity: '0.7' },
					'100%': { transform: 'scale(1.5)', opacity: '0' }
				},
				'fabric-movement': {
					'0%': { backdropFilter: 'blur(3px)', transform: 'scale(1.001)' },
					'50%': { backdropFilter: 'blur(4px)', transform: 'scale(1.003) translate(-2px, 1px)' },
					'100%': { backdropFilter: 'blur(3px)', transform: 'scale(1.001)' },
				},
				'subtle-shift': {
					'0%, 100%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(2px) translateY(-1px)' },
					'50%': { transform: 'translateX(0) translateY(2px)' },
					'75%': { transform: 'translateX(-2px) translateY(0)' },
				},
				'moire-pattern': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '10% 10%' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
				'heartbeat': 'heartbeat 2.5s ease-in-out infinite',
				'ripple-slow': 'ripple 4s ease-out infinite',
				'ripple-medium': 'ripple 3s ease-out infinite 0.5s',
				'fabric-movement': 'fabric-movement 8s ease-in-out infinite',
				'subtle-shift': 'subtle-shift 15s ease-in-out infinite',
				'moire-pattern': 'moire-pattern 20s linear infinite',
				'fade-in': 'fade-in 0.5s ease-out'
			},
			backgroundImage: {
				'hero-pattern': 'linear-gradient(135deg, #FF9D6C 10%, #BB4E75 100%)',
				'section-pattern': 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)',
				'pulse-gradient': 'linear-gradient(225deg, #FF719A 0%, #FFA99F 48%, #FFE29F 100%)',
				'heart-gradient': 'linear-gradient(to right, #ee9ca7, #ffdde1)',
				'purepix-gradient': 'linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
