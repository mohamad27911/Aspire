## Running the Application

To run the Event Planner application, you need to start both the backend (FastAPI) and frontend (React) servers.

**1. Start the Backend Server (FastAPI):**

   a.  Open a terminal.
   b.  Navigate to your backend project directory (where `main.py` and your Python `venv` are located).
       ```bash
       # Example:
       # cd path/to/your/project/backend
       ```
   c.  Activate your Python virtual environment:
       ```bash
       # Windows
       .\venv\Scripts\activate
       # macOS/Linux
       source venv/bin/activate
       ```
   d.  Start the FastAPI server:
       ```bash
       uvicorn main:app --reload --port 8000
       ```
       *   The backend API will typically be available at `http://localhost:8000`.
       *   Keep this terminal window open.

**2. Start the Frontend Development Server (React):**

   a.  Open a **new terminal** window (leave the backend server terminal running).
   b.  Navigate to your frontend project directory (where `package.json` is located).
       ```bash
       # Example:
       # cd path/to/your/project/Aspire
       ```
   c.  Start the React development server (use the command for your package manager):
       *   **If using pnpm:**
           ```bash
           pnpm dev
           ```
       *   **If using npm:**
           ```bash
           npm run dev
           ```
       *   **If using yarn:**
           ```bash
           yarn dev
           ```
       *   The frontend will typically be available at `http://localhost:5173` (Vite's default). The terminal will display the exact URL.

**3. Open the Application in Your Browser:**

   Once both servers are running without errors:
   *   Open your web browser.
   *   Go to the URL provided by the frontend development server (usually `http://localhost:5173`).

You should now be able to use the Event Planner application. The chatbot will communicate with the backend running on port 8000.
