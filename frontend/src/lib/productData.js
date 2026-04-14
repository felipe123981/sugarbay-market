
    export const allProductsSource = [
       { id: 1, name: "Handcrafted Wooden Bowl", price: 45.00, seller: "Artisan Woodworks", imageSeed: "wooden bowl nature", description: "Beautifully handcrafted bowl...", category: "Home Goods", stock: 10, sellerId: "1", dateAdded: "2025-04-15", salesCount: 150 },
       { id: 2, name: "Vintage Leather Jacket", price: 120.00, seller: "Retro Finds", imageSeed: "vintage leather jacket model", description: "Classic brown leather jacket...", category: "Apparel", stock: 1, sellerId: "2", dateAdded: "2025-03-20", salesCount: 250 },
       { id: 3, name: "Abstract Canvas Painting", price: 250.00, seller: "Modern Art Creations", imageSeed: "abstract colorful painting", description: "Vibrant abstract art piece...", category: "Art", stock: 5, sellerId: "3", dateAdded: "2025-02-10", salesCount: 30 },
       { id: 4, name: "Ceramic Mug Set", price: 30.00, seller: "Pottery Place", imageSeed: "handmade ceramic mugs coffee", description: "Set of 4 handmade ceramic mugs.", category: "Kitchenware", stock: 20, sellerId: "4", dateAdded: "2025-04-05", salesCount: 180 },
       { id: 5, name: "Wireless Bluetooth Headphones", price: 89.99, seller: "Tech Gear", imageSeed: "sleek wireless headphones", description: "Noise-cancelling headphones.", category: "Electronics", stock: 15, sellerId: "5", dateAdded: "2025-01-15", salesCount: 300 },
       { id: 6, name: "Organic Cotton T-Shirt", price: 25.00, seller: "Eco Threads", imageSeed: "plain white organic cotton t-shirt", description: "Soft and sustainable basic tee.", category: "Apparel", stock: 50, sellerId: "6", dateAdded: "2025-05-01", salesCount: 90 },
       { id: 7, name: "Stainless Steel Water Bottle", price: 19.50, seller: "Hydrate Pro", imageSeed: "metal water bottle hiking", description: "Durable and insulated water bottle.", category: "Outdoor", stock: 30, sellerId: "7", dateAdded: "2025-03-01", salesCount: 220 },
       { id: 8, name: "Minimalist Wall Clock", price: 55.00, seller: "Time Designs", imageSeed: "minimalist modern wall clock", description: "Silent non-ticking wall clock.", category: "Home Decor", stock: 12, sellerId: "8", dateAdded: "2025-04-28", salesCount: 70 },
       { id: 9, name: "Running Shoes", price: 95.00, seller: "Fast Feet", imageSeed: "modern running shoes", description: "Lightweight and comfortable running shoes.", category: "Apparel", stock: 25, sellerId: "9", dateAdded: "2025-02-20", salesCount: 160 },
       { id: 10, name: "Yoga Mat", price: 35.00, seller: "Zen Zone", imageSeed: "rolled up yoga mat", description: "Eco-friendly non-slip yoga mat.", category: "Sports", stock: 40, sellerId: "10", dateAdded: "2025-03-10", salesCount: 110 },
       { id: 11, name: "Gourmet Coffee Beans", price: 18.00, seller: "Bean Masters", imageSeed: "roasted coffee beans bag", description: "Single-origin Arabica coffee beans.", category: "Food & Drink", stock: 100, sellerId: "11", dateAdded: "2025-05-05", salesCount: 50 },
       { id: 12, name: "Smart Watch", price: 199.00, seller: "Tech Gear", imageSeed: "smart watch display", description: "Feature-rich smart watch.", category: "Electronics", stock: 8, sellerId: "5", dateAdded: "2025-01-25", salesCount: 200 },
     ];
    
    export const categories = ["All", ...new Set(allProductsSource.map(p => p.category))];
    export const maxPrice = Math.ceil(Math.max(...allProductsSource.map(p => p.price)));
  