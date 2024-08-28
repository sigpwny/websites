import fs from 'fs';
import path from 'path';

async function main() {
    // Check if the collection exists locally

    const fetchMeetings = async () => {
        const meetingsPath = path.join(__dirname, '..', '..', 'dist', 'meetings', 'all.json');
        if (fs.existsSync(meetingsPath)) {
            const data = fs.readFileSync(meetingsPath, 'utf8');
            return JSON.parse(data);
        }

        const response = await fetch('https://sigpwny.com/meetings/all.json');
        return response.json();
    }
    
    const fetchEvents = async () => {
        const eventsPath = path.join(__dirname, '..', '..', 'dist', 'events', 'all.json');
        if (fs.existsSync(eventsPath)) {
            const data = fs.readFileSync(eventsPath, 'utf8');
            return JSON.parse(data);
        }

        const response = await fetch('https://sigpwny.com/events/all.json');
        return await response.json();
    }

    const meetings = await fetchMeetings();
    console.log(meetings);

    const events = await fetchEvents();
    console.log(events);
}

main();