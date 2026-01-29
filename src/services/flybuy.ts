const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTripRequest(tripData: any) {
    if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not defined');

    // Expected: { client_name, client_email, origin_city, proposed_dates }
    const res = await fetch(`${API_URL}/api/public/fly-buy/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Fly & Buy request failed');
    }

    return res.json();
}
