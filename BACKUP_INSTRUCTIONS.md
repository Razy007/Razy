# Pi Academy Social - Backup & Usage Instructions

This folder contains the complete source code and development environment for the Pi Academy Social application.

## 🚀 How to Run (Development Mode)

To start the application and verifying the work (as you did on localhost):

1.  Open a terminal (Command Prompt or PowerShell) in this folder.
2.  Run the command:
    ```bash
    npm run dev
    ```
3.  Open your browser to `http://localhost:5173/` (or the URL shown in the terminal).

## 🛠️ Project Status

- **Last Updated**: 2025-12-17
- **State**: Production Ready (Short Term Improvements Implemented)
- **Key Features**:
  - Pi SDK Integration (with Guest Mode fallback)
  - Course Content (Wallet, KYC, Scams)
  - Cloud Persistence (Firebase + LocalStorage)

## 📦 Deployment (Optional)

If you want to create a production build for hosting:

1.  Run `npm run build`
2.  The optimized files will be created in the `dist/` folder.

## ⚠️ Notes

- **Node Modules**: This backup includes the `node_modules` folder, so you don't need to run `npm install` again unless you move to a new machine.
- **Firebase**: Remember to update `src/services/firebase.ts` with your real API keys if you haven't already.
