
export async function fetchEvents({signal, searchTerms}) {
    let url = 'http://localhost:3000/events';

    if (searchTerms) {
        url += `?search=${searchTerms}`;
    }
    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { events } = await response.json();

    return events;
}