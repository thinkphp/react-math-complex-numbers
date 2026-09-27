# Complex Number Calculator

A responsive React calculator for performing arithmetic with complex numbers. Enter two numbers in the form **a + bi** and get the result instantly.

## Features

- Addition, subtraction, multiplication, and division
- Live results as you edit either number
- Complex number formatting that handles zero and unit imaginary parts
- Clear feedback when dividing by zero
- Save recent calculations during the current session
- Responsive layout for desktop and mobile

## Built with

- React
- Vite
- JavaScript
- CSS
- Lucide icons

## Getting started

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. To create a production build:

```bash
npm run build
```

## Math

For `z₁ = a + bi` and `z₂ = c + di`:

| Operation | Result |
| --- | --- |
| Addition | `(a + c) + (b + d)i` |
| Subtraction | `(a − c) + (b − d)i` |
| Multiplication | `(ac − bd) + (ad + bc)i` |
| Division | `((ac + bd) / (c² + d²)) + ((bc − ad) / (c² + d²))i` |

Division is undefined when `z₂ = 0`.

## Project structure

```text
complex-calculator/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    └── style.css
```
