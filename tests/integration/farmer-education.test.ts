import { test, expect } from '@playwright/test';

test.describe('Farmer Education Features', () => {
  test('accessing educational resources', async ({ page }) => {
    await page.goto('/education');
    
    // Verify resource categories
    const categories = [
      'Crop Management',
      'Sustainable Farming',
      'Market Insights',
      'Technology Adoption',
    ];
    
    for (const category of categories) {
      await expect(page.getByRole('heading', { name: category })).toBeVisible();
    }
    
    // Test video playback
    await page.getByRole('link', { name: 'Introduction to Organic Farming' }).click();
    const video = page.locator('video');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('src');
  });

  test('interactive learning modules', async ({ page }) => {
    await page.goto('/education/modules');
    
    // Start a learning module
    await page.getByRole('link', { name: 'Soil Management' }).click();
    
    // Complete module sections
    const sections = ['Introduction', 'Soil Types', 'pH Levels', 'Assessment'];
    for (const section of sections) {
      await page.getByRole('button', { name: `Complete ${section}` }).click();
      await expect(page.getByText('Section completed')).toBeVisible();
    }
    
    // Verify completion certificate
    await expect(page.getByText('Module completed')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Certificate' })).toBeVisible();
  });

  test('market price notifications', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Enable price alerts
    await page.getByRole('button', { name: 'Price Alerts' }).click();
    await page.getByLabel('Rice').check();
    await page.getByLabel('Minimum price').fill('500');
    await page.getByRole('button', { name: 'Save Alerts' }).click();
    
    // Verify alert setup
    await expect(page.getByText('Price alert saved')).toBeVisible();
    
    // Check notification delivery
    await page.goto('/notifications');
    await expect(page.getByText('Price Alert Settings')).toBeVisible();
  });
});