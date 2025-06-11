import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user registration', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill registration form
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill(`test-${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('Test123!@#');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Verify success message
    await expect(page.getByText('Account created successfully')).toBeVisible();
    await expect(page).toHaveURL('/auth/sign-in');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Submit empty form
    await page.getByRole('button', { name: 'Create account' }).click();

    // Verify validation messages
    await expect(page.getByText('Full name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('should allow user sign in', async ({ page }) => {
    await page.goto('/auth/sign-in');
    
    // Fill login form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('Test123!@#');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
  });
});