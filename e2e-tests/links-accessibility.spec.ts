import { test, expect } from '@playwright/test';
import { checkA11y, injectAxe } from './helpers/accessibility';

test.describe('LinkFlow - Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('LinkCard e Section devem ser acessíveis', async ({ page }) => {
    // Verifica acessibilidade geral da página
    await checkA11y(page);
    
    // Verifica se o botão de colapsar/expandir tem atributos aria corretos
    const sectionHeader = page.locator('.section-header').first();
    await expect(sectionHeader).toHaveAttribute('role', 'button');
    await expect(sectionHeader).toHaveAttribute('aria-expanded', 'true');
    
    // Colapsa a seção e verifica se o atributo aria-expanded muda
    await sectionHeader.click();
    await expect(sectionHeader).toHaveAttribute('aria-expanded', 'false');
    
    // Expande novamente para verificar se retorna ao estado original
    await sectionHeader.click();
    await expect(sectionHeader).toHaveAttribute('aria-expanded', 'true');
  });

  test('Links devem ter contraste adequado', async ({ page }) => {
    // Verifica se há erros de contraste nos links
    await checkA11y(page, '.link-card');
  });
});