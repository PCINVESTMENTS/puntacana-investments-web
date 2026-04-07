'use server'

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://puntacana-fortress-production.up.railway.app";

    // Extract data from FormData
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const comments = formData.get('comments') as string;

    // Additional fields
    const experience = formData.get('experience') as string || 'N/A';
    const horizon = formData.get('horizon') as string || 'N/A';
    const visited = formData.get('visited') as string || 'N/A';
    
    // Check dynamic select/input correctly
    const propertySelection = formData.get('specificPropertySelect') as string;
    const propertyInput = formData.get('specificPropertyName') as string;
    const specificProperty = (propertySelection === 'other' || !propertySelection) ? propertyInput : propertySelection; 

    const tripData = {
        client_name: name,
        client_email: email,
        client_phone: phone,
        origin_city: country,
        proposed_dates: 'Por Definir', 
        notes: `Comments: ${comments}\nObjectives: ${formData.getAll('objective').join(', ')}\nProperty Type: ${formData.getAll('propertyType').join(', ')}\nExperience: ${experience}\nHorizon: ${horizon}\nVisited DR: ${visited}\nSpecific Property: ${specificProperty || 'None'}`
    };

    try {
        const res = await fetch(`${apiUrl}/api/public/fly-buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData),
        });

        // Cortocircuito de éxito inmediato si el servidor responde 200 o 201
        if (res.ok || res.status === 201 || res.status === 200) {
            return { success: true, message: 'Request sent successfully!' };
        }

        const errorText = await res.text();
        console.error("Backend Error:", errorText);
        return { success: false, message: 'Failed to submit request to backend.' };

    } catch (error) {
        console.error("Server Action Error:", error);
        return { success: false, message: 'Internal server error.' };
    }
}
