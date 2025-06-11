import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
  test('Farmer registration and verification', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill registration form
    await page.getByLabel('Full Name').fill('Test Farmer');
    await page.getByLabel('Email').fill(`farmer-${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByRole('combobox', { name: 'I am a' }).click();
    await page.getByRole('option', { name: 'Farmer' }).click();
    
    await page.getByRole('button', { name: 'Create account' }).click();
    
    // Verify successful registration
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome to Gardenia')).toBeVisible();
    
    // Complete profile setup
    await page.getByRole('button', { name: 'Complete Profile' }).click();
    await page.getByLabel('Farm Name').fill('Test Farm');
    await page.getByLabel('Farm Size').fill('100');
    await page.getByLabel('Farming Type').click();
    await page.getByRole('option', { name: 'Organic' }).click();
    
    await page.getByRole('button', { name: 'Save Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
  });

  test('Buyer registration and first purchase', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill registration form
    await page.getByLabel('Full Name').fill('Test Buyer');
    await page.getByLabel('Email').fill(`buyer-${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByRole('combobox', { name: 'I am a' }).click();
    await page.getByRole('option', { name: 'Buyer' }).click();
    
    await page.getByRole('button', { name: 'Create account' }).click();
    
    // Complete first purchase
    await page.goto('/products');
    await page.getByRole('link', { name: 'Rice' }).first().click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    
    // Fill shipping details
    await page.getByLabel('Address').fill('123 Test Street');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('State').fill('Test State');
    await page.getByLabel('Postal Code').fill('12345');
    
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText('Order placed successfully')).toBeVisible();
  });
});