src/
├── components/     # Reusable UI components
├── containers/     # Container components (connected to Redux)
├── features/       # Feature-specific components and logic
├── styles/         # Global styles and theme configurations
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── services/       # API services (RTK Query)
├── app/            # Redux store setup
├── App.tsx         # Root component
└── index.tsx       # Entry point


Script Context

1. Popup Context
2. Service Worker Context 
    chrome.action.onClick.addListerner(tab => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id},
            func: () => {
                alert('Hello from my extension')
            }
        });
    });

3. Page Context (Content Scripts) - page the user is looking at