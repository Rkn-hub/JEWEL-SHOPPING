// Supabase Client Initialization
// Replace the placeholders with your actual project URL and API Key from the Supabase Dashboard.

const SUPABASE_URL = 'https://ovtdltxjmjkatwjfwusw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dGRsdHhqbWprYXR3amZ3dXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTE0MzQsImV4cCI6MjA4NDU4NzQzNH0.eQ6vkhoQMbvrED8vtbIpRKETpqC142Sl979AEGYjSIs';

// Initialize the Supabase client using the CDN-loaded library
let supabase;

try {
    if (typeof supabase === 'undefined' && typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized successfully');
    } else {
        console.warn('⚠️ Supabase library not found. Ensure the script tag is included in your HTML.');
    }
} catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
}

window.supabaseClient = supabase;
