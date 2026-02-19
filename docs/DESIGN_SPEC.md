# Publipacks — Design Specification

> Source: [Figma — Publipacks](https://www.figma.com/design/Gi47aqMDiUuPmGDoTggZDA/Publipacks?node-id=0-1)

## 1. Overview

**Canvas dimensions:**
- Mobile: 393 × 852 px
- Desktop: 1280 × 832 px

**Main screens (frames):**
- BEGIN — initial screen with spinner
- WIN — win screen
- CLAIM — form to claim prize
- CLAIMED — prize claimed
- LOOSE — loss
- Desktop Example — desktop version

---

## 2. Color Palette

| Name | HEX | Usage |
|-----------|-----|---------------|
| `#8FCCEA` | Background | Page background (light blue) |
| `#72C2F0` | Accent | Background elements (Vector 1) |
| `#BDE2F4` | Stroke | Vector 1 stroke |
| `#FFFFFF` | White | Fills, text |
| `#FFD7EB` | Pink | Spin 2 Win Header, strokes |
| `#FFA2DC` | Bright pink | Machine Container gradient, spinner stroke |
| `#FFEDD9` | Cream | Spinners Internal fill |
| `#FF8B00` | Orange | Stroke, button accents |
| `#FFE7CA` | Light orange | Chain stroke |
| `#AEFB8B` | Green | Spin Now / Claim button |
| `#DCF7CD` | Light green | Button stroke |
| `#BBE3F2` | Light blue text | Spin'2'win heading |
| `#2066BB` | Blue | Heading stroke, popup text |
| `#F2EBEE` | Light | Button text |
| `#B3B3B3` | Gray | Form placeholders |
| `#000000` | Black | Spinner offer text |

**Gradients:**
- **Popup Container:** `radial-gradient(circle at 50% 50%, #FFF7FB 0%, #FFA2DC 100%)`
- **Machine Container:** `radial-gradient(circle at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)`
- **Links (Chain):** `radial-gradient(circle at 50% 50%, #FFE7CA 35%, #FF8B00 100%)`
- **Light On:** `radial-gradient(circle at 37% 35%, #FFF6EB → #FFC981 → #FFA827 → #D98625)`

---

## 3. Typography

| Style | Font | Size | Weight | Usage |
|-------|-------|--------|-----|---------------|
| style_E1X0BV | Bungee | 40px | 400 | Spin'2'win, ! WINNER !, Try Again |
| style_D8HVWQ | Bungee | 40px | 400 | Spin Now, Spin Again, Claim Now, timer |
| style_QHP4NH | Bungee | 30px | 400 | Claim Now (large) |
| style_YWSK8N | Bungee | 24px | 400 | "Jose.m just won" (popup) |
| style_5AB1X2 | Bungee | 15px | 400 | "50% off at adidas" (popup) |
| style_2KZODB | Roboto | 15px | 900 | Spinner offers (UPPERCASE) |
| style_5NXEXP | Roboto | 24px | 900 | 30% OFF (UPPERCASE) |
| style_X6JNCR | Roboto | 12px | 900 | Form labels, "Enter Your details" (UPPERCASE) |

**Text effects:**
- `textShadow: 0px 0px 5px rgba(0,0,0,0.25)` — for headings

---

## 4. Components

### 4.1 Chain
- ID: `3:26`
- Composition: Rectangle 2 + Links
- Size: 23 × 108 px
- Stroke: `#FFE7CA` 4px
- Used for decorative chains on the sides

### 4.2 Lights
- **Light On** — lit (5 lights on win)
- **Light Off** — off
- Size: 20 × 20 px
- On effect: glow `rgba(255,227,194,0.55)`, `rgba(255,176,81,0.4)`

### 4.3 Lights Winner
- 7 variants (Group 2–7) — On/Off combinations for win animation

### 4.4 Offer on Spinner
- Universal block for offer text
- Font: Roboto 900, 15px, UPPERCASE
- Text color: `#000000`

### 4.5 Form Fields
- Fields: First Name, Last Name, Email, Phone
- Field size: 214 × 30 px
- Border radius: 5px
- Placeholder: `#B3B3B3`, Roboto 900, 12px

### 4.6 Popup Container (Just Won Popup)
- Size: 295 × 52 px (content)
- Border radius: 15px
- Fill: radial gradient (#FFF7FB → #FFA2DC)
- Stroke: `#FFD7EB` 3px

---

## 5. Key Blocks and Dimensions

### Spin 2 Win Header
- Size: 282 × 65 px
- Border radius: 40px 40px 20px 20px
- Fill: `#FFD7EB`
- Shadow: `0px 0px 10px 5px rgba(255,255,255,0.85)`

### Machine Container
- Size: 358 × 281 px (BEGIN) / 358 × 398 px (CLAIM)
- Border radius: 70px
- Fill: radial gradient
- Shadow: `0px 0px 10px 5px rgba(255,255,255,0.85)`, `inset 0px 0px 20px 5px rgba(255,255,255,0.85)`

### Spinners
- Size: 336 × 219 px
- Border radius: 60px
- Internal fill: `#FFEDD9`
- Stroke: `#FF8B00` 4px
- Center lines (pointers): `#FFA2DC` 3px

### Spin Now / Claim Now Button
- Size: 282 × 58 px
- Border radius: 20px
- Fill: `#AEFB8B`
- Stroke: `#DCF7CD` 4px
- Shadow: `0px 0px 5px 1px rgba(0,0,0,0.25)`

---

## 6. Spinner Offers (examples)

- 30% off
- 50% off
- 25% off
- Free Socks
- Free Gift

Layout: 9 sectors (3×3)

---

## 7. Screen Texts

### BEGIN
- Heading: "Spin'2'win"
- Button: "Spin Now"
- Popup: "Jose.m just won" / "50% off at adidas"

### WIN
- Heading: "! WINNER !"
- Buttons: "Spin Again", "Claim Now"
- Prize text: "You have won 30% OFF Online and in store at VANS"

### CLAIM
- Heading: "! WINNER !"
- Button: "Claim Now"
- Text: "30% OFF", "Enter Your details to claim your prize"
- Form: First Name, Last Name, Email, Phone

### CLAIMED
- Heading: "Spin'2'win"
- Timer: "23:59:50"
- Text: "30% OFF — Your prize has been sent to your email", "Congratulations"

### LOOSE
- Heading: "Try Again"
- Timer: "23:59:55"
- Text: "Better Luck Next Spin! Try again tomorrow. Next spin unlocks in 24 hours"

---

## 8. Mask Group (background)

- Rectangle 4, 5: 393 × 852 px, fill `#8FCCEA`
- Repeat group with Vector 1: decorative pattern
- Vector 1: `#72C2F0`, stroke `#BDE2F4` 2px, shadow `0px 0px 20px rgba(189,226,244,1)`

---

## 9. Figma Links

- **File:** https://www.figma.com/design/Gi47aqMDiUuPmGDoTggZDA/Publipacks
- **Node (Page 1):** `0-1`

---

*Document generated from Figma API data. Last updated: 2025-02-13.*
