// Vercel Web Analytics
// This script initializes Vercel Web Analytics for tracking page views

// Initialize the analytics queue
window.va = window.va || function() { 
	(window.vaq = window.vaq || []).push(arguments); 
};

console.log('[Vercel Analytics] Queue initialized');

// Dynamically load the analytics script
(function() {
	// Detect environment - analytics only run in production
	const isDevelopment = window.location.hostname === 'localhost' || 
	                      window.location.hostname === '127.0.0.1' ||
	                      window.location.protocol === 'file:';
	
	if (isDevelopment) {
		console.log('[Vercel Analytics] Development mode detected - analytics disabled');
		return;
	}

	// Create and inject the analytics script
	const script = document.createElement('script');
	script.defer = true;
	script.src = '/_vercel/insights/script.js';
	
	script.onerror = function() {
		console.warn('[Vercel Analytics] Failed to load analytics script');
	};
	
	script.onload = function() {
		console.log('[Vercel Analytics] Analytics script loaded successfully');
	};
	
	document.head.appendChild(script);
})();
