AI Chatter Studio is a comprehensive, AI-powered integrated development environment (IDE) for rapidly prototyping and building modern web and desktop applications. Using natural language prompts, developers can generate, preview, and export full-featured React web applications and Electron desktop applications with native Windows executables.

The studio is designed for a seamless development workflow, integrating an AI chat engine powered by Google's Gemini, real-time collaboration features, a built-in version control system, an AI media asset manager, and one-click export for multiple platforms.

Core Features
AI-Powered App Generation: Leverage the power of the Gemini API to generate complete, functional React components and application logic from natural language prompts.
Dual Target Architecture: Seamlessly switch between building a React Web SPA and a native Electron Desktop Application, with the AI engine adapting its output to the chosen target.
Instant Windows Packaging: Generate and download ready-to-run 64-bit Windows executables (AIChatter.exe) and installers (AIChatter-Setup.exe) directly from the studio. These launchers intelligently use the system's installed Chrome/Edge in App Mode for a native, chromeless window experience.
Live Application Preview: See your generated application come to life in a real-time, interactive preview panel that simulates a native desktop window environment, complete with OS-style menus and notifications.
Real-Time Team Collaboration: A built-in WebSocket server enables live, multi-user code editing, shared cursors, presence indicators, and a project-specific team chat.
Integrated Media Asset Manager: Generate AI-powered 4K images and Veo video loops directly within the studio and insert them into your application's codebase with a single click.
Git-Based Version Control: Manage your project's history with an integrated version control system that supports branching, committing, and reverting to previous snapshots.
Cloud Project Hosting: Deploy your web applications to the cloud with support for custom subdomains and SSL, managed through the "Plus Go Pro" subscription panel.
Tech Stack
Frontend: React 19, TypeScript, Vite, Tailwind CSS, Lucide React
Backend: Node.js, Express, WebSocket (ws)
AI Engine: Google Gemini API (@google/genai)
Desktop Export:
Electron project structure for source code export.
C language source code (launcher_source.c, setup_source.c) compiled on-the-fly into native Windows .exe launchers for exported bundles.
Getting Started
To run AI Chatter Studio locally, you will need Node.js and npm installed.

Installation & Setup
Clone the repository:

git clone https://github.com/jovanyjosol/aichatter-apk.git
cd aichatter-apk
Install dependencies:

npm install
Set up environment variables: Create a .env file in the root directory by copying the example file:

cp .env.example .env
Open the .env file and add your Google Gemini API key:

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
Note: The AI chat functionality relies on the Gemini API. If the key is not provided, the application will use a limited fallback engine.

Running the Application
Development Mode: Run the following command to start the development server, which includes the Express backend and the Vite frontend with HMR.

npm run dev
The application will be available at http://localhost:3000.

Production Mode: First, build the frontend and backend assets:

npm run build
Then, start the production server:

npm run start
Key Functionalities
Windows Executable Generation
A standout feature of AI Chatter Studio is its ability to generate native Windows executables (.exe) without requiring a local build environment. This is achieved through a unique process:

The backend (server.ts) serves pre-compiled C programs (launcher_source.c, setup_source.c) which have been encoded in Base64.
When a user requests a Windows export (/api/export/exe), the server decodes the Base64 string and serves it as a downloadable .exe file.
This generated executable is a lightweight native launcher. When run on Windows, it:
Searches for an index.html file in its directory.
Detects if Google Chrome or Microsoft Edge is installed.
Launches the index.html file in the browser's "App Mode" (--app=...), creating a borderless window that feels like a native desktop application.
Includes a user-friendly setup wizard (AIChatter-Setup.exe) for a more traditional installation experience.
AI Chat & Code Generation
The core AI functionality is handled by the /api/chat endpoint.

It receives the user's prompt, the current code from the editor, and the target application type (Web or Electron).
A detailed system instruction is provided to the Gemini model, guiding it to act as an expert full-stack and Electron architect.
The model generates a response in structured Markdown, which includes explanations, code blocks (```tsx), and suggested follow-up prompts.
The frontend parses this response, automatically applying tsx code changes to the live preview and displaying other information in the chat panel.
Collaboration Server
Real-time collaboration is powered by a WebSocket server running at /ws/collaborate. It manages connections from multiple clients in a project room and broadcasts events for:

user:joined / user:left: Team presence and roster updates.
cursor:move: Live cursor tracking across different files.
code:edit: Synchronizing file content changes between users.
chat:message: Broadcasting messages in the team chat.
commit:push: Notifying team members of new version control commits.
