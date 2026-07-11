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

        let contactId = null;

        if (response.status === 409) {
            const errorData = await response.json().catch(() => null);
            console.log(`HubSpot: Contact with email ${data.email} already exists (409).`);
            
            // Extract existing ID from message "Contact already exists. Existing ID: 12345"
            if (errorData && errorData.message) {
                const match = errorData.message.match(/Existing ID: (\d+)/);
                if (match && match[1]) {
                    contactId = match[1];
                }
            }
        } else if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('HubSpot API Error (Contact):', response.status, errorData);
            return { success: false, status: response.status, error: errorData };
        } else {
            const json = await response.json();
            contactId = json.id;
            console.log(`HubSpot: Successfully created contact ${contactId}`);
        }

        // 2. Create Deal and associate with Contact if we have the Contact ID
        if (contactId) {
            const dealUrl = 'https://api.hubapi.com/crm/v3/objects/deals';
            
            // Clean budget string to get numbers only for the amount, or default to 0
            const cleanAmount = data.budget ? data.budget.replace(/[^0-9]/g, '') : "0";

            const dealPayload = {
                properties: {
                    dealname: `Oportunidad: ${data.firstname} ${data.lastname || ''}`.trim(),
                    pipeline: "default", // Pipeline Inmobiliario PCI
                    dealstage: "1349257301", // "1. Lead Nuevo"
                    amount: cleanAmount
                },
                associations: [
                    {
                        to: { id: contactId },
                        types: [
                            {
                                associationCategory: "HUBSPOT_DEFINED",
                                associationTypeId: 3 // Deal-to-Contact
                            }
                        ]
                    }
                ]
            };

            const dealRes = await fetch(dealUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dealPayload),
            });

            if (!dealRes.ok) {
                const dealErr = await dealRes.json().catch(() => null);
                console.error('HubSpot API Error (Deal):', dealRes.status, dealErr);
                // We still return true because contact was handled, but deal failed
                return { success: true, contactId, dealCreated: false, dealError: dealErr };
            }

            const dealJson = await dealRes.json();
            console.log(`HubSpot: Successfully created Deal ${dealJson.id}`);
            return { success: true, contactId, dealId: dealJson.id };
        }

        return { success: true, contactId };
    } catch (error) {
        console.error('Failed to send to HubSpot:', error);
        return { success: false, error };
    }
}
