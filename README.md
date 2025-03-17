# Cinema Booking Mobile App

A React Native mobile application for browsing movies and booking cinema tickets, complete with seat selection, food & beverage ordering, and payment processing.

## Project Overview

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Project Duration**: 4 Days

## Setup & Run Instructions

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android simulator)
- Xcode (for iOS simulator, Mac only)
- Use Own Device and Download Expo Go

### Installation

1. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd cinema-booking-server
   npm install

   # Create .env file (required)
   echo PORT=3000 > .env
   echo TMDB_API_KEY=your_api_key_here >> .env

   # Install frontend dependencies
   cd ../cinema-booking
   npm install
   ```

### Running the Application

#### Backend Server

```bash
cd cinema-booking-server
node index.js
```

The server will start on port 3000.

#### Frontend with Expo

```bash
cd cinema-booking
npx expo start
```

### Android Studio Simulator

1. **Open Android Studio**
2. Select "More Actions" > "Virtual Device Manager"
3. Create a virtual device if none exists:
   - Click "Create Device"
   - Select a phone model (e.g., Pixel 4)
   - Download and select a system image (at least API level 28+)
   - Finish the configuration
4. Launch the virtual device from the AVD Manager
5. In your Expo terminal, press `a` to run on Android

## Project Structure

```
demo-mobile-app-dev/
├── cinema-booking/         # React Native mobile app
│   ├── app/                # App screens (using file-based routing)
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants and configuration
│   ├── styles/             # Style definitions
│   └── utils/              # Helper functions
│
├── cinema-booking-server/  # Backend Express server
    ├── controllers/        # API route handlers
    ├── models/             # Data models
    ├── routes/             # API endpoint definitions
    └── index.js            # Server entry point
```

## Troubleshooting

- **Metro bundler issues**: Use `npx expo start --clear` to clear cache
- **Simulator connection problems**: Ensure simulator is fully loaded first
- **Backend API errors**: Verify server is running and check console for errors

## Development Workflow

1. Setup and Create Necessary Pages
2. Created Classes for Data Structure
3. Integrated with TMDB for the Real Scenario Movie Data
4. Setup Core Functionality and Tested out Real Life Scenarios
5. Payment Method Validation Tested
6. Bookings is listed when the payment is done

## Self Test

You can download Expo Go App on Google Play Store or App Store. Once is downloaded, you can scan the QRCode shown when you ran 
`npx expo start` 
or 
`npx expo start --clear`

After that, you can test out the functionality.