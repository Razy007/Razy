# Pioneer Authentication Module

## Overview

The **Pioneer Authentication Module** provides a strict, secure entry point for the application, ensuring that only verified Pioneers can access sensitive financial features (Staking, Shop).

## Features

1.  **Dual Entry Modes**:
    - **Connect with Pi Key**: Launches official Pi SDK authentication.
    - **Guest Mode**: Limited access for auditors or dev testing.
2.  **KYC Gating**:
    - **Verified**: Full access to Staking and Shop.
    - **Unverified/Guest**: Staking and Shop are visible but interactive actions are blocked with a clear warning.
3.  **Visual Feedback**:
    - **Login Screen**: Premium UI with animated background.
    - **Dashboard**: Shows "Premium/Verified" badge for authenticated users.

## Testing

- **Localhost**:
  - Click "Connect with Pi" -> Simulates Verified Pioneer.
  - Click "Guest Mode" -> Simulates Unverified User.
- **Pi Browser**:
  - Should trigger real Pi Auth flow.
