# StudyOS

StudyOS is a powerful AI-driven study platform designed to help students master anything faster, analyze knowledge gaps, generate structured mock tests, create flashcards, and intelligently manage their exam preparation. StudyOS turns passive reading into highly adaptive tracking sessions.

## 🚀 Features

- **Brain Connect**: Upload your study materials (text, JSON, PDF, Image) and let the engine instantly analyze them to generate custom quizzes, video scripts, presentation outlines, and mnemonics.
- **Global Exams**: Practice against standard test configurations via a connected TestLFrame engine, including built-in camera/microphone proctoring simulations.
- **Exam Practitioner**: Sequentially solve mock previous year question (PYQ) papers, auto-evaluate solutions based on study notes context, and dynamically generate new conceptual exam papers mimicking the exact original test structure.
- **Recruit AI & Scorecards**: Create advanced radar-chart skills analysis from PDF documents.
- **AI Agent Booker**: Book real-time study sessions with an AI agent.

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) 
- **Language:** TypeScript / React
- **Styling:** Tailwind CSS
- **Database / Backend:** Firebase Firestore
- **AI Engine:** Google Gemini SDK (`gemini-2.5-flash`), Groq AI, Vapi, Tavus. 

## 📦 Setting Up the Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parthsharma17prs/studyos-hackathon-platform.git
   cd studyos-hackathon-platform
   ```

2. **Install core dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory by copying the `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   # Add additional required Firebase keys...
   ```

4. **Initialize TestLFrame (Global Mock Tests):**
   StudyOS depends on `testlframe` for Global Exam simulations. 
   Navigate to its folder, install packages and start the backend/frontend services separately.
   ```bash
   # From the project root
   cd ../testlframe/backend && npm install && npm start
   cd ../testlframe/frontend && npm install && npm run dev
   ```

5. **Start StudyOS:**
   Open a new terminal while leaving TestLFrame running:
   ```bash
   npm run dev
   ```

6. **Open platform:** Navigate to `http://localhost:3000`

## 💡 Usage Highlights

- **Troubleshooting Mock Tests:** If you are not seeing any global mock tests layout, verify that `testlframe/frontend` is successfully initialized and running on your `localhost:5173`.
- **Knowledge Set Generation**: Choose format preferences (Video matching, PPT summaries, Visual prompts) and let the engine create interactive data. Ensure your API keys are actively working. 
