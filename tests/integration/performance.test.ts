import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

test.describe('Performance Benchmarks', () => {
  test.beforeEach(async ({ page }) => {
    // Clear caches and service workers
    await page.context().clearCookies();
  });

  test('Homepage load performance', async ({ page }) => {
    const startTime = performance.now();
    await page.goto('/');
    const loadTime = performance.now() - startTime;
    
    // Performance benchmarks
    expect(loadTime).toBeLessThan(3000); // 3s maximum load time
    
    // Core Web Vitals
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries[0].value);
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });
    expect(cls).toBeLessThan(0.1); // Good CLS score
  });

  test('Product search response time', async ({ page }) => {
    await page.goto('/products');
    
    const searchInput = page.getByPlaceholder('Search products...');
    const startTime = performance.now();
    
    await searchInput.fill('rice');
    await page.waitForResponse(response => 
      response.url().includes('/api/products/search')
    );
    
    const responseTime = performance.now() - startTime;
    expect(responseTime).toBeLessThan(1000); // 1s maximum response time
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 768, height: 1024 }, // iPad
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check for mobile menu visibility
      const mobileMenu = page.getByRole('button', { name: /menu/i });
      await expect(mobileMenu).toBeVisible();
      
      // Verify layout integrity
      const layoutShift = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              cls += entry.value;
            }
            resolve(cls);
          }).observe({ entryTypes: ['layout-shift'] });
          setTimeout(() => resolve(cls), 1000);
        });
      });
      
      expect(layoutShift).toBeLessThan(0.1);
    }
  });
});