import type { Config } from "tailwindcss";

export default {
	darkMode: "class", // Enable light/dark mode toggle
	content: [
		"./index.html",
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
				'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
				'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
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
					foreground: 'hsl(var(--card-foreground))',
					light: 'hsl(var(--card-light))',
					medium: 'hsl(var(--card-medium))',
					darker: 'hsl(var(--card-darker))',
					darkest: 'hsl(var(--card-darkest))'
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
				// OBSIDIAN-CHROME STRICT PALETTE (HSL format)
				obsidian: {
					DEFAULT: 'hsl(240, 8%, 4%)', // #0A0A0C Deep obsidian black
					graphite: 'hsl(240, 7%, 10%)', // #1A1A1D Graphite
					carbon: 'hsl(240, 8%, 7%)', // #131416 Carbon grey
				},
				platinum: {
					glow: 'hsl(0, 0%, 89%)', // #E4E4E4 Platinum silver glow
				},
				chrome: {
					highlight: 'hsl(0, 0%, 75%)', // Pearl grey for chrome effects
				},
				'music-focus': 'hsl(var(--music-focus))',
				'music-mood': 'hsl(var(--music-mood))',
				'music-sleep': 'hsl(var(--music-sleep))',
				'music-energy': 'hsl(var(--music-energy))',
				'teal': {
					'50': 'hsl(173, 75%, 95%)',
					'100': 'hsl(176, 75%, 86%)',
					'500': 'hsl(182, 63%, 32%)',
					'600': 'hsl(182, 61%, 26%)',
					'700': 'hsl(182, 63%, 20%)'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-card-blue': 'var(--gradient-card-blue)',
				'gradient-card-medium': 'var(--gradient-card-medium)',
				'gradient-card-dark': 'var(--gradient-card-dark)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-dark-bg': 'var(--gradient-dark-bg)',
				'gradient-primary-teal': 'var(--gradient-primary-teal)',
				'gradient-hero-teal': 'var(--gradient-hero-teal)',
				'gradient-card-teal': 'var(--gradient-card-teal)',
				'gradient-glass-teal': 'var(--gradient-glass-teal)',
				'gradient-dark-teal': 'var(--gradient-dark-teal)',
				'gradient-textured-teal': 'var(--gradient-textured-teal)',
				'gradient-white-section': 'var(--gradient-white-section)',
				'glass-gradient': 'var(--glass-bg)',
				'glass-border': 'var(--glass-border)',
				'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'player': 'var(--shadow-player)',
				'glass': 'var(--glass-shadow)',
				'glass-lg': 'var(--glass-shadow)',
				'glass-enhanced': 'var(--glass-shadow-enhanced)',
				'glass-dark-shadow': 'var(--glass-dark-shadow)',
				'glass-inset': 'inset 0 1px 0 0 hsl(var(--border) / 0.1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'hover-lift': {
					'0%': {
						transform: 'translateY(0) scale(1)'
					},
					'100%': {
						transform: 'translateY(-8px) scale(1.02)'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: 'var(--shadow-card)'
					},
					'50%': {
						boxShadow: '0 12px 40px hsl(217 91% 60% / 0.4), 0 6px 20px hsl(217 91% 5% / 0.5)'
					}
				},
				'ripple-wave': {
					'0%': {
						transform: 'translateY(0) scale(1)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'translateY(-10px) scale(1.02)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(0) scale(1)',
						opacity: '0.6'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'hover-lift': 'hover-lift 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'ripple-wave': 'ripple-wave 6s ease-in-out infinite',
				'gentle-float': 'gentle-float 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
