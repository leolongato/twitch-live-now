# Twitch Live Now

A browser extension that helps Twitch users quickly see which followed streamers are currently live without opening Twitch.

The extension authenticates users through Twitch OAuth, fetches followed live channels using the Twitch API, and displays them directly inside the browser through a lightweight and responsive interface.

## Features

- 🔴 View followed Twitch channels currently live
- 🔐 Secure Twitch OAuth authentication flow
- 🔄 Automatic token refresh handling
- ⚡ Real-time updates with automatic stream refresh
- 🖥️ Chrome Side Panel integration
- 🌐 Cross-browser support (Chrome and Firefox)
- 📱 Responsive and clean UI
- 📄 Stream pagination for easier navigation
- 💾 Local storage persistence for authentication tokens

## Tech Stack

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **SWR** (data fetching and caching)
- **Axios**
- **React Router**
- **Headless UI**
- **Radix UI**
- **Lucide React**
- **Motion**

### Browser Extension

- **WebExtension API**
- **webextension-polyfill**
- **vite-plugin-web-extension**

### Authentication

- **Twitch OAuth 2.0**
- Automatic access token refresh

## Architecture

The extension follows a modular structure:

```
src/
├── api/           # Twitch API integration and token management
├── components/    # UI components
├── context/       # Authentication and application context
├── lib/           # Utilities
├── types/         # TypeScript definitions
├── background.ts  # Browser extension background service
└── App.tsx        # Main application entry
```

### Main Flow

1. User authenticates through Twitch OAuth
2. Access token is securely stored locally
3. Extension fetches followed live streams using Twitch API
4. Stream list updates automatically every 30 seconds
5. Expired tokens are refreshed transparently

## Development

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build Chrome extension

```bash
npm run chrome
```

### Build Firefox extension

```bash
npm run firefox
```

## Environment Variables

Create a `.env` file:

```env
VITE_TWITCH_CLIENT_ID=your_client_id
VITE_TWITCH_CLIENT_SECRET=your_client_secret
VITE_USE_TWITCH_MOCK_API=false
```

## Future Improvements

- Desktop notifications for live streams
- Stream filtering and favorites
- Stream category filtering
- Better analytics and watch history
- Additional Twitch integrations

## License

MIT
