# FitCubes — Calorie & Macro Tracker

FitCubes is a modern, mobile-first web application designed for precise calorie and macro tracking, with special focus on accurate nutrition calculations for home-cooked meals and complex recipes.

---

## 🚀 Live Demo

- **Frontend Demo (Draft):** [fit-cubes-draft.vercel.app](https://fit-cubes-draft.vercel.app/)

---

## ✨ Key Features

- 🍲 **Home-Cooked Meal Calculator:** Input raw ingredient weights, record final cooked weight, and automatically calculate exact macros ($P / C / F / \text{kcal}$) per 100g of the finished dish.
- 📊 **Daily Diary & Budgeting:** Real-time tracking of calories and macronutrient ratios based on personal metabolic formulas (BMR / TDEE).
- 🔍 **Smart Food Search & Filtering:** Filter by custom categories, search by query, and sort by Protein/Calorie ratio to hit daily targets efficiently.
- 🎨 **Modern Mobile-First UI:** Built with sleek dark mode aesthetics, glassmorphism, dynamic transitions, and touch-friendly controls.
- ⚙️ **Custom Products & Meals:** Create custom single-product entries or full multi-ingredient saved recipes.

---

## 🛠️ Tech Stack

### Frontend
- **Core:** React 19, Vite, TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS, Vanilla CSS Design Tokens
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend (Integration Pending)
- **Architecture:** RESTful API
- **Stack:** Java / Spring Boot

---

## 🚀 Getting Started

Follow these steps to run the frontend application locally:

```bash
# 1. Clone the repository
git clone https://github.com/FitCubes/frontend.git

# 2. Navigate into the frontend directory
cd fit-cubes-frontend

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

---

## 📖 Project Background & Motivation

<details>
<summary><b>Click to expand origin story</b></summary>
<br>

Tracking calories and protein is essential for sustainable health goals, but existing market tools often struggle with complex, multi-ingredient home-cooked meals. 

Most databases rely on static pre-made dish estimates (e.g., standard Bolognese sauce), which introduce significant margin of error for custom recipes. Furthermore, AI photo recognition often lacks accuracy for exact portion macro breakdowns.

FitCubes was initially conceived to solve this exact problem: providing a dedicated tool where users can input raw ingredient weights, specify the final cooked weight, and automatically derive precise nutrition data per 100g. What started as an internal prototype has evolved into a full-featured collaborative team project.

</details>

---

## 🤝 Team & Collaboration

Developed collaboratively as part of the **FitCubes** team project.
