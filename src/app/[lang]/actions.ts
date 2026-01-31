"use server";

import { unstable_noStore as noStore } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_API_URL || 'http://localhost:5050';

async function fetchFromApi(endpoint: string, params: Record<string, any> = {}) {
    // Prevent caching to ensure fresh data, or configure as needed
    noStore();

    const url = new URL(`${API_BASE_URL}/api/public/${endpoint}`);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, String(params[key]));
        }
    });

    try {
        const res = await fetch(url.toString(), {
            cache: 'no-store', // Adjust caching strategy as needed
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(`API call failed: ${url.toString()} - ${res.status} ${res.statusText}`);
            return null;
        }

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error(`Error fetching from API ${url.toString()}:`, error);
        return null;
    }
}

export async function getCategoryById(idOrSlug: string) {
    const category = await fetchFromApi(`categories/${idOrSlug}`);
    return category;
}

export async function getProductsByCategory(categoryId: string) {
    const products = await fetchFromApi('products', { categoryId, limit: 100 });
    return products || [];
}

export async function getFeaturedProducts(limit: number = 6) {
    const products = await fetchFromApi('products', { limit });
    return products || [];
}

export async function getLatestProducts(limit: number = 8) {
    const products = await fetchFromApi('products', { limit });
    return products || [];
}

export async function getDealOfTheDay() {
    // Fetch products with discount, sorted by discount
    const products = await fetchFromApi('products', {
        hasDiscount: true,
        sortBy: 'discount',
        limit: 1
    });
    return products && products.length > 0 ? products[0] : null;
}

export async function getCategories() {
    const categories = await fetchFromApi('categories');
    return categories || [];
}

export async function getFlashDeals(limit: number = 6) {
    const products = await fetchFromApi('products', {
        hasDiscount: true,
        sortBy: 'discount',
        limit
    });
    return products || [];
}

export async function getTopSellers(limit: number = 6) {
    const response = await fetchFromApi('vendors', { limit }); // Our API returns { data: [], pagination: {} } inside success
    // Wait, my fetchFromApi returns json.data.
    // For 'vendors', endpoint returns { success: true, data: [...], pagination: ... }
    // So fetchFromApi returns the array directly.
    return response || [];
}

export async function getBanners() {
    const banners = await fetchFromApi('banners');
    return banners || [];
}

export async function getHomePageData() {
    // Optimized: Fetch all data in a single request from the Node API
    const homeData = await fetchFromApi('home');

    if (!homeData) {
        return {
            featuredProducts: [],
            latestProducts: [],
            dealOfTheDay: null,
            categories: [],
            flashDeals: [],
            topSellers: [],
            banners: []
        };
    }

    return homeData;
}

export async function getProductById(idOrSlug: string) {
    // Try by slug first if it looks like a slug, or just try both endpoints? 
    // The previous implementation utilized ID lookup for admin, but for public frontend we often use slug.
    // The node API has /api/public/products/:slug which finds by slug.
    // Let's assume the public frontend uses SLUGS. Ideally 'id' passed here is actually a slug.
    // IF it is an ID (UUID), we might need to adjust the API.
    // However, the requested URL was product/de4c41c7... (UUID).
    // Our Node API /api/public/products/:slug searches where { slug: slug }.
    // If we pass an ID as a slug, it won't be found unless the slug is the ID.
    // We should update the Node API to support lookup by ID as well or update this to use a specific endpoint.
    // Let's try to fetch by slug first (current Node API behavior).
    // If the frontend uses UUID as the slug param, we must match that.

    // BUT wait, looking at the user request: /km/product/de4c41c7...
    // The previous implementation imported getProductById from super-admin-depo actions which uses ID.
    // We need to support fetching by ID or Slug.
    // Let's add a `getProductById` that fetches from our Node API.
    // Since Node API currently only has `vendors/:slug` and `products/:slug` (finding unique by slug),
    // we might need to update Node API or assume the param is a slug.
    // If the URL is /product/:id, then it is an ID.
    // Let's check if the Node API can be updated to find by ID or Slug.
    // For now, I'll update this action to use the `products` endpoint with a filter if possible, or just add support in Node API.

    // Actually, clean solution: Add an endpoint to Node App for /api/public/products/:id OR allow the search to work.
    // Let's rely on adding a queryparam or similar? No, standard REST is clean.
    // Users detail page is often by Slug. The user URL shows UUID.
    // I will implement fetching by ID via a query param on the list endpoint (hacky) OR add proper endpoint.
    // Node API Code: app.get('/api/public/products/:slug' ... unique where slug: slug.
    // I will update Node API to separate ID vs Slug or allowing both.

    // For now, let's just make the function here invoke the API.
    // I'll assume I will fix the Node API in the next step to support ID lookup too.

    const product = await fetchFromApi(`products/${idOrSlug}`);
    return product;
}

