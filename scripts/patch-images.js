
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'w7gp05my',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

// Full properties list again to have the URLs
const properties = [
    {
        id: 1,
        image: "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/10/1.jpg"
        ]
    },
    {
        id: 2,
        image: "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg"
        ]
    },
    {
        id: 3,
        image: "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg"
        ]
    },
    {
        id: 4,
        image: "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        id: 5,
        image: "/images/property-penthouse-generated.png",
        gallery: []
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 7,
        image: "/images/golf-villa-generated.png",
        gallery: []
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 9,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 11,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 12,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 13,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        gallery: []
    },
    {
        id: 14,
        image: "/images/rental-condo-generated.png",
        gallery: []
    },
    {
        id: 15,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
        gallery: []
    }
];

async function patch() {
    console.log('Starting patch...');

    // Fetch all existing properties from Sanity
    const existingProperties = await client.fetch('*[_type == "property"]{_id, id}');

    for (const p of properties) {
        const existing = existingProperties.find(ep => ep.id === p.id);

        if (existing) {
            try {
                await client.patch(existing._id)
                    .set({
                        imageUrl: p.image,
                        galleryUrls: p.gallery || []
                    })
                    .commit();
                console.log(`Patched property ${p.id}: ${existing._id}`);
            } catch (err) {
                console.error(`Failed to patch ${p.id}:`, err.message);
            }
        } else {
            console.warn(`Property ${p.id} not found in Sanity.`);
        }
    }
}

patch();
