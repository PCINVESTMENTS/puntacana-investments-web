import 'server-only';

export async function createHubspotContact(data: {
    email: string;
    firstname: string;
    lastname?: string;
    phone?: string;
    message?: string;
    budget?: string;
    property_detail?: string;
    property_type?: string;
    form_source?: string;
}) {
    const token = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!token) {
        console.warn('No HubSpot token configured. Skipping HubSpot sync.');
        return null;
    }

    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
    
    // Map data to HubSpot properties
    const properties: Record<string, string> = {
        email: data.email,
        firstname: data.firstname,
    };

    if (data.lastname) properties.lastname = data.lastname;
    if (data.phone) properties.phone = data.phone;
    if (data.message) properties.message = data.message;
    
    if (data.budget) {
        properties.budget = data.budget;
        properties.presupuesto_estimado_usd = data.budget;
    }
    if (data.property_detail) properties.property_detail = data.property_detail;
    if (data.property_type) properties.property_type = data.property_type;
    
    if (data.form_source) properties.hs_lead_status = "NEW";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ properties }),
        });

        if (response.status === 409) {
            console.log(`HubSpot: Contact with email ${data.email} already exists (409).`);
            return { success: true, existing: true };
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('HubSpot API Error:', response.status, errorData);
            return { success: false, status: response.status, error: errorData };
        }

        const json = await response.json();
        console.log(`HubSpot: Successfully created contact ${json.id}`);
        return { success: true, data: json };
    } catch (error) {
        console.error('Failed to send to HubSpot:', error);
        return { success: false, error };
    }
}
