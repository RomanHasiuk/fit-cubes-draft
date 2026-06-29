# Calorie Tracker (Draft)

A comprehensive calorie and macro tracking application prototype built with React. This draft was created to solve the pain points of inaccurate macro tracking for home-cooked meals, providing a solid foundation for the upcoming team project.

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI / shadcn/ui
- **State Management:** Zustand
- **Routing:** React Router

## 🚀 Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/RomanHasiuk/fit-cubes-draft.git
```

2. Navigate into the directory:
```bash
cd fit-cubes-draft
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 📖 Background: Why I started building this app

<details>
<summary><b>Click to read the full origin story</b></summary>
<br>

There came a time when extra kilos started sticking to me a lot more eagerly than before. 😆 So I decided to control my diet. Not just calories, but protein intake too. After all, you can lose weight in different ways: the weight drops, but the body fat percentage stays almost the same. That's why protein was just as important a metric for me. Although, I have to admit, I was quite the theorist in these matters, but a pretty weak practitioner. 😄

Even before studying at Mate Academy, I created a Google Sheet with formulas for myself. At first, I added simple products from local grocery stores, then added items from cafes, restaurants, and even McDonald's.

The most interesting part began when I cooked my own meals. I had to weigh all the raw ingredients, calculate their macros, then weigh the finished dish and roughly estimate what portion I ate. As a result, I had to keep separate calculations for each ingredient and constantly recalculate things.

It worked. It even brought results. But it was time-consuming, inconvenient, and not very accurate, because we are all human: there is always a temptation to slightly lower the logged calories to leave yourself the moral right to a piece of dessert in the evening. 😆

Later on, I added calorie expenditure for various activities to the table: from workouts to regular apartment cleaning. Macros (PFC) ratios and different formulas appeared. Effectively, the spreadsheet was gradually turning into a small app, although I wasn't even thinking about it at the time.

About two years passed. I had stopped doing this "nonsense" and completely forgot about tracking, only remembering it when I stood in front of the mirror thinking: "Oops, looks like it's time to open my spreadsheets again." 😄

Then, about a month ago, my wife's trainer organized a 40-day calorie and protein control challenge. The participants used modern apps (some even with AI features). I, on the other hand, downloaded another popular app that I once used as an example for my spreadsheet.

And here I started noticing things that really annoyed me.

Everything is fine in the app with individual products, but with complex meals, there's a huge margin of error. For example, if I make my own Bolognese sauce, not a single pre-made option from the database matches my recipe. I had to either put up with inaccurate data or manually enter each raw ingredient separately.

In my wife's app, the AI identified food by photo. Great idea, but the error margin was sometimes even bigger than my manual calculations.

Since I've been studying in the Fullstack course at Mate for a while now, I thought: "What if I create a tool that allows you to enter raw ingredients, cook the meal, specify the weight of the finished product, and automatically get exact macros per 100 grams?"

Initially, it was meant to be a very simple internal tool just for myself — literally a single React component. Enter raw products -> get a finished meal that is saved to the database as a separate new product with real numbers.

But one idea led to another.

I wanted to keep separate profiles for myself and my wife. Then came authorization, search, sorting, and favorite recipes. I added tooltips for terms like BMR or MET, explaining why age and height affect metabolism. Then the idea came up to give the user hints: which products are more cost-effective based on the "price / protein amount" ratio, and how to hit the daily goal without exceeding calories.

And the further I went, the more I realized how complex this seemingly "simple" tracker actually is. That's honestly when I realized I couldn't build the full vision alone without sacrificing either quality or my sanity. I settled for having the core logic working, but now... now I have you guys! With our combined skills, what was just an overgrown spreadsheet can become a truly awesome product.

You have to consider data validation, error handling, duplicate recipes, recalculation logic, and a ton of small details. I went through all of this myself, without a QA team, designers, analysts, or a PM. Just as a user trying to solve his own problem. That's why this project gave me much more than just coding practice — it showed me how many people stand behind a working product.

I used to think: you write the code, eyeball it to make sure it works, hook up a domain, deploy it to a server — and you can just kick back and relax. 😄 Now I know that a good product is the result of teamwork.

There are still plenty of ideas for development: integrating scientific articles on nutrition (without TikTok myths), recipes from top chefs, and the ability to share your meals with friends. But that will probably be "too much" for us for the next 4 weeks. So the plan is this: first, get the core app polished, and think about extra features in parallel.

</details>
