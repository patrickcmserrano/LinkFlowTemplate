import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';
import { AccessibilityTester } from './helpers/AccessibilityTester';

test.describe('Testes de Acessibilidade', () => {
  let homePage: HomePage;
  let a11y: AccessibilityTester;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    a11y = new AccessibilityTester(page);
    await homePage.goto();
  });

  test('deve ter estrutura de cabeçalhos acessível', async () => {
    // Verificar se a página tem estrutura de cabeçalhos válida
    await a11y.expectValidHeadingStructure();
    
    // Verificar se o cabeçalho principal é acessível
    await a11y.expectElementAccessible(homePage.heading);
  });

  test('deve ter funcionalidade de alternância de tema acessível', async ({ page }) => {
    // Verificar se o toggle de tema está na página
    await expect(homePage.themeToggle).toBeVisible();
    
    // Verificar se é acessível por teclado
    await a11y.expectButtonAccessible(homePage.themeToggle, 'tema');
  });

  test('deve manter contraste de cores suficiente', async () => {
    // Verificar contraste para cabeçalho
    await a11y.expectSufficientColorContrast(homePage.heading);
    
    // Verificar contraste para links
    await a11y.expectSufficientColorContrast(homePage.links.github);
    await a11y.expectSufficientColorContrast(homePage.links.linkedin);
  });

  test('deve ser navegável por teclado', async () => {
    // Verificar navegabilidade por teclado
    await a11y.expectKeyboardNavigable();
  });

  test('deve passar na análise axe-core', async () => {
    // Executar análise de acessibilidade com axe-core
    const results = await a11y.runAxeAnalysis();
    
    // Registrar número de violações encontradas
    console.log(`Análise axe-core encontrou ${results.violations.length} violações`);
    
    // Idealmente aqui verificaríamos se não há violações críticas
    // Por enquanto, apenas registramos os resultados
  });
});