import { test, expect } from '@playwright/test';

test.describe('Language Support', () => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ha', name: 'Hausa' },
    { code: 'ig', name: 'Igbo' },
  ];

  for (const lang of languages) {
    test(`supports ${lang.name} language`, async ({ page }) => {
      await page.goto('/');
      
      // Change language
      await page.getByRole('button', { name: 'Select language' }).click();
      await page.getByRole('option', { name: lang.name }).click();
      
      // Verify key UI elements are translated
      const elements = {
        header: page.getByRole('banner'),
        searchPlaceholder: page.getByPlaceholder('Search products...'),
        categoriesMenu: page.getByRole('navigation'),
        footer: page.getByRole('contentinfo'),
      };
      
      for (const [key, element] of Object.entries(elements)) {
        await expect(element).toBeVisible();
        const text = await element.textContent();
        expect(text).not.toBe('');
      }
    });

    test(`supports ${lang.name} in chat assistance`, async ({ page }) => {
      await page.goto('/chat');
      
      // Set language
      await page.getByRole('combobox', { name: 'Select language' }).click();
      await page.getByRole('option', { name: lang.name }).click();
      
      // Test chat interaction
      await page.getByRole('textbox').fill('Hello');
      await page.getByRole('button', { name: 'Send' }).click();
      
      // Verify response in selected language
      const response = await page.getByRole('log').textContent();
      expect(response).not.toBe('');
    });
  });
});