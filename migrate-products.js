// Product Migration Script for The Vrinda Creation
// Run this in the browser console on products.html to push initial data to Supabase

async function migrateProducts() {
    if (!window.supabaseClient) {
        console.error('❌ Supabase client not found!');
        return;
    }

    const products = [
        {
            name: "Bohemian Dreams",
            price: 1250,
            description: "Turquoise & Wood Beads",
            category: "Necklaces",
            image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Wire-Wrapped Elegance",
            price: 850,
            description: "Glass & Silver Wire",
            category: "Earrings",
            image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Macramé Harmony",
            price: 750,
            description: "Stone & Cotton Cord",
            category: "Bracelets",
            image_url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Festival Statement",
            price: 1650,
            description: "Multi-Color Beadwork",
            category: "Necklaces",
            image_url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Floral Seed Bead Bracelet",
            price: 950,
            description: "Seed Beads & Thread",
            category: "Bracelets",
            image_url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Pearl Crystal Drops",
            price: 1450,
            description: "Pearl & Crystal",
            category: "Earrings",
            image_url: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Multi-Strand Bohemian",
            price: 2150,
            description: "Mixed Beads",
            category: "Necklaces",
            image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        },
        {
            name: "Geometric Anklet",
            price: 650,
            description: "Glass Beads",
            category: "Anklets",
            image_url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
        }
    ];

    console.log('🚀 Starting migration...');

    for (const product of products) {
        const { data, error } = await window.supabaseClient
            .from('products')
            .insert([product]);

        if (error) {
            console.error(`❌ Failed to migrate ${product.name}:`, error.message);
        } else {
            console.log(`✅ Migrated: ${product.name}`);
        }
    }

    console.log('🏁 Migration complete!');
}

window.migrateProducts = migrateProducts;
