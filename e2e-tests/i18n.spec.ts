import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n) Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should display the language selector', async ({ page }) => {
    // Check if language buttons are present
    const enButton = page.getByRole('button', { name: 'English' });
    const ptButton = page.getByRole('button', { name: 'Português' });
    const esButton = page.getByRole('button', { name: 'Español' });
    
    await expect(enButton).toBeVisible();
    await expect(ptButton).toBeVisible();
    await expect(esButton).toBeVisible();
  });

  test('should allow changing the language', async ({ page }) => {
    // Get initial title and subtitle for comparison
    const initialTitle = await page.getByRole('heading', { level: 1 }).textContent();
    const initialSubtitle = await page.getByText('Software Engineering').textContent();
    
    // Change to Portuguese
    const ptButton = page.getByRole('button', { name: 'Português' });
    await ptButton.click();
    
    // Wait for the text to change (may need to adjust this time)
    await page.waitForTimeout(500);
    
    // Check if the subtitle has been updated
    const subtitleAfterChange = await page.getByText('Engenharia de Software').textContent();
    expect(subtitleAfterChange).not.toBe(initialSubtitle);
    
    // Change to Spanish
    const esButton = page.getByRole('button', { name: 'Español' });
    await esButton.click();
    
    // Wait for the text to change
    await page.waitForTimeout(500);
    
    // Check if the subtitle has been updated again
    const subtitleAfterSecondChange = await page.getByText('Ingeniería de Software').textContent();
    expect(subtitleAfterSecondChange).not.toBe(initialSubtitle);
    expect(subtitleAfterSecondChange).not.toBe(subtitleAfterChange);
  });

  test('should display texts corresponding to the selected language', async ({ page }) => {
    // Expected texts in each language (based on locale files)
    const expectedTexts = {
      en: {
        title: 'Patrick CM Serrano',
        subtitle: 'Software Engineering'
      },
      pt: {
        title: 'Patrick CM Serrano',
        subtitle: 'Engenharia de Software'
      },
      es: {
        title: 'Patrick CM Serrano',
        subtitle: 'Ingeniería de Software'
      }
    };
    
    // Test each language
    const languages = [
      { code: 'en', button: page.getByRole('button', { name: 'English' }) },
      { code: 'pt', button: page.getByRole('button', { name: 'Português' }) },
      { code: 'es', button: page.getByRole('button', { name: 'Español' }) }
    ];
    
    for (const lang of languages) {
      // Change to the language
      await lang.button.click();
      
      // Wait for the text to change
      await page.waitForTimeout(500);
      
      // Check the title
      const title = await page.getByRole('heading', { level: 1 }).textContent();
      expect(title).toContain(expectedTexts[lang.code].title);
      
      // Check the subtitle
      const subtitle = page.getByText(expectedTexts[lang.code].subtitle, { exact: true });
      await expect(subtitle).toBeVisible();
    }
  });

  test('should persist language preference between reloads', async ({ page }) => {
    // Change to Portuguese
    const ptButton = page.getByRole('button', { name: 'Português' });
    await ptButton.click();
    
    // Wait for the text to change
    await page.waitForTimeout(500);
    
    // Record the subtitle text in Portuguese
    const subtitleInPortuguese = await page.getByText('Engenharia de Software').textContent();
    
    // Reload the page
    await page.reload();
    
    // Wait for the page to fully load after reload
    await page.waitForLoadState('networkidle');
    
    // Check if the text is still in Portuguese after reload
    const subtitleAfterReload = await page.getByText('Engenharia de Software').textContent();
    expect(subtitleAfterReload).toBe(subtitleInPortuguese);
  });
});