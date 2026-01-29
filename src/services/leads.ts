const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function submitLead(formData: any) {
    if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not defined');

    // Expected: { first_name, last_name, email, phone, message, source? }
    const res = await fetch(`${API_URL}/api/public/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Lead submission failed');
    }

    return res.json();
}
