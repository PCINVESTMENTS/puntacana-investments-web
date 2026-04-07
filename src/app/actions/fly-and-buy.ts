'use server'

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    // Obligamos a la acción a ir directo a Railway, ignorando NEXT_PUBLIC_API_URL de Vercel.
    const apiUrl = "https://puntacana-fortress-production.up.railway.app";

    // Extract data from FormData
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const country = (formData.get('country') as string) || '';
    const comments = (formData.get('comments') as string) || '';

    // Additional fields
    const experience = formData.get('experience') as string || 'N/A';
    const horizon = formData.get('horizon') as string || 'N/A';
    const visited = formData.get('visited') as string || 'N/A';
    
    // Arrays for multiple checkboxes
    const objectives = formData.getAll('objective').join(', ') || 'N/A';
    const propertyTypes = formData.getAll('propertyType').join(', ') || 'N/A';
    const investmentFocus = formData.getAll('investmentFocus').join(', ') || 'N/A';
    const motivation = formData.getAll('motivation').join(', ') || 'N/A';

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
        notes: `Comments: ${comments}\nObjectives: ${objectives}\nProperty Type: ${propertyTypes}\nInvestment Focus: ${investmentFocus}\nExperience: ${experience}\nHorizon: ${horizon}\nVisited DR: ${visited}\nMotivation: ${motivation}\nSpecific Property: ${specificProperty || 'None'}`
    };

    const cleanedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    try {
        const res = await fetch(`${cleanedApiUrl}/api/public/fly-buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData),
        });

        // Cortocircuito de éxito inmediato si el servidor responde 200 o 201
        if (res.ok || res.status === 201 || res.status === 200) {
            return { success: true, message: 'Request sent successfully!' };
        }

        const errorText = await res.text();
        console.error("Backend Error:", res.status, errorText);
        return { success: false, message: `Rechazado por el servidor: ${res.status} - ${errorText}` };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, message: `Error de red: ${error.message}` };
    }
}
