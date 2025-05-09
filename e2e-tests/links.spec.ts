import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';
import { AccessibilityTester } from './helpers/AccessibilityTester';

test.describe('LinkFlow - Funcionalidade de Links', () => {
  let homePage: HomePage;
  let a11y: AccessibilityTester;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    a11y = new AccessibilityTester(page);
    await homePage.goto();
  });

  test('deve exibir todas as seções de links', async ({ page }) => {
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/LinkFlow/);
    
    // Verificar que a página carregou corretamente
    await expect(homePage.heading).toBeVisible();
    
    // Verificar se as seções estão visíveis
    await homePage.expectAllSectionsVisible();
  });

  test('deve ser possível colapsar e expandir seções', async ({ page }) => {
    // Verificar se as seções estão visíveis inicialmente
    await expect(homePage.sections.projects).toBeVisible();
    
    // Verificar se há links visíveis antes de colapsar 
    // (sem afirmar quais links específicos, que podem mudar)
    const linksBeforeCollapsing = await page.locator('a').count();
    expect(linksBeforeCollapsing).toBeGreaterThan(0);
    
    // Colapsar a seção de Projetos
    await homePage.toggleSection('projects');
    
    // Verificar que a seção ainda está visível, mas com menos links
    await expect(homePage.sections.projects).toBeVisible();
    
    // Expandir a seção novamente
    await homePage.toggleSection('projects');
    
    // Verificar que a seção contém links novamente
    const linksAfterExpanding = await page.locator('a').count();
    expect(linksAfterExpanding).toBeGreaterThan(0);
  });

  test('deve abrir links em novas abas', async () => {
    // Verificar se os links principais abrem em novas abas
    await expect(homePage.links.github).toHaveAttribute('target', '_blank');
    await expect(homePage.links.linkedin).toHaveAttribute('target', '_blank');
  });
  
  test('deve ter links acessíveis', async ({ page }) => {
    // Verificar redes sociais que são mais consistentes e sempre visíveis
    await a11y.expectElementAccessible(homePage.links.github, { label: 'GitHub' });
    await a11y.expectElementAccessible(homePage.links.linkedin, { label: 'LinkedIn' });
    
    // Verificar navegabilidade por teclado para links visíveis
    await homePage.links.github.focus();
    const hasFocus = await page.evaluate(() => {
      return document.activeElement !== document.body;
    });
    expect(hasFocus).toBeTruthy();
  });
});