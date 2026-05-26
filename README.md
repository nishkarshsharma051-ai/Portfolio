# Nishkarsh Sharma • Interactive Developer Portfolio

Welcome to your state-of-the-art personal developer portfolio! This portfolio features high-end visual designs, a fluid glassmorphism theme, magnetic micro-interactions, responsive side-scrolling timelines, and an interactive playroom.

---

## 🌟 Interactive Features

*   **🎮 Retro Preloader**: A simulated asset preloading screen showcasing progressive percentages, a background skill marquee, and an active **retro 2D bouncy ball arcade mini-game** with coordinate-based mouse glows.
*   **🌌 Dynamic Constellation Hero**: An interactive HTML5 Canvas node constellation background. Moving nodes drift smoothly, drawing connection trails that react to mouse tracking positions.
*   **💫 Magnet Cursor Trailing**: A custom lag-free cursor follower that scales, frames, and glows when hovering over interactive elements.
*   **🛠️ Vertical-to-Horizontal Pinning**: As desktop visitors scroll *vertically*, featured projects slide *horizontally* across the screen using optimized **GSAP ScrollTrigger Pinned timelines**.
*   **📈 Scroll-Drawn Timeline**: A professional education/career timeline where the connecting neon guide-line **draws itself downward** as visitors scroll.
*   **♟️ AI Chess Arena**: Play chess against a custom heuristic **MiniMax Chess AI Engine with Alpha-Beta Pruning** running locally at depth 3. Features validation squares, check warnings, captured trays, and active move logs.
*   **💬 Talk with Nishkarsh chatbot**: An active chat panel where visitors can converse with your AI persona to learn about your projects, skills, education at **IIT Madras**, and hiring availability!

---

## ⚙️ Project Structure

```
src/
├── components/
│   ├── config.ts          <-- Central developer details, projects, experiences
│   ├── Cursor.tsx         <-- Custom trailing neon tracker
│   ├── Navbar.tsx         <-- Lenis scroll manager & sticky anchor header
│   ├── LoadingScreen.tsx  <-- Retro bouncing ball game loader
│   ├── Hero.tsx           <-- Constellation particle network canvas & entry slide
│   ├── About.tsx          <-- Biography glass panels
│   ├── Skills.tsx         <-- Highlighted competencies card rows
│   ├── Experience.tsx     <-- Timeline cards with scroll-drawn connection lines
│   ├── WorkHorizontal.tsx <-- Side-scrolling featured portfolio projects
│   ├── TechPyramid.tsx    <-- Stack rows displaying Devicon CDNs
│   └── Contact.tsx        <-- Footer CTA panels and email links
├── pages/
│   ├── Home.tsx           <-- Main layout assembling all vertical sections
│   ├── MyWorks.tsx        <-- Grid projects detail deck
│   └── Play.tsx           <-- Minimax chess vs AI and talking chatbot simulator
├── index.css              <-- Main stylesheet (HSL vars, layouts, keyframes)
├── App.tsx                <-- React-Router routing setup
└── main.tsx               <-- Entry root rendering hooks
```

---

## 🚀 Running Locally

All dependencies are pre-installed and compilation-verified!

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```
2. **Start the local development server**:
   ```bash
   npm run dev
   ```
3. **Compile a production bundle**:
   ```bash
   npm run build
   ```

---

## ✏️ Customizing Your Details

Updating your portfolio details is incredibly easy! Simply open **[config.ts](file:///Users/nishkarshsharma/Documents/Projectssss/Port%20folio/src/components/config.ts)** and modify the fields.

### 📋 Customizing Projects:
Add, edit, or delete items inside the `projects` array:
```ts
{
  id: 1,
  title: "Your Project Name",
  category: "Web App / Machine Learning",
  technologies: "React, Python, PyTorch",
  image: "https://images.unsplash.com/... (Image URL)",
  description: "A short details paragraph explaining what you built."
}
```

### 📄 Linking Your Resume:
Place your professional resume PDF named `resume.pdf` inside the `public/` directory (e.g., `public/resume.pdf`). The resume buttons in the floating sidebar and footer will work instantly!

---

## ☁️ Deployment

Since the portfolio builds into static HTML/CSS/JS assets, you can deploy it for free in seconds:

### ⚡ Deploy on Vercel:
1. Install the Vercel CLI: `npm install -g vercel`
2. Run: `vercel`

### 🍀 Deploy on Netlify:
1. Drag and drop the compiled `dist/` folder into Netlify's web console.
2. Or use Netlify CLI: `npm install -g netlify-cli` followed by `netlify deploy --dir=dist`.
