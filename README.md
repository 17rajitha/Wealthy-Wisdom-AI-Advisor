<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1m40MhERkZZZQ-ZoVUBqxhgnuAkHZi7YO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


   ---

🛡️ Technical Maturity & Security Note
Current Status: This is a Path 1 Prototype built for the Scaler/Google Startup School.

Production Roadmap (Path 2): > To transition this application into a public-facing product, the following security upgrades are planned:

Server-Side Architecture: Migrating Gemini API calls to a secure backend (Google Cloud Run) to prevent client-side API key exposure.

User Protection: Implementing Google OAuth for secure user authentication.

Cost Management: Adding rate-limiting to protect against bot abuse and uncontrolled API charges.

