// event-fetcher-worker.ts

const apiUrl = 'https://polisen.se/api/events';
const fetchInterval = 60 * 60 * 1000; // Fetch every hour

async function fetchAndPostEvents() {
    try {
        const response = await fetch(apiUrl);
        const events = await response.json();

        if (events && events.length > 0) {
            // Use the Fetch API to post events to the backend
            await fetch('/postNewPoliceEvents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(events),
            });
        }
    } catch (error) {
        console.error('Error fetching or posting events:', error);
    }
}

// Set up periodic background fetch
setInterval(fetchAndPostEvents, fetchInterval);

// Initial fetch and post when the service worker is installed
self.addEventListener('install', (event) => {
    event.waitUntil(fetchAndPostEvents());
});
