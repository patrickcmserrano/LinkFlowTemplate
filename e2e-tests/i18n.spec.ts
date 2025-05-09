import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';
import { AccessibilityTester } from './helpers/AccessibilityTester';

// Pular teste de acessibilidade no WebKit
test.describe('Internacionalização (i18n)', () => {
  let homePage: HomePage;
  let a11y: AccessibilityTester;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    a11y = new AccessibilityTester(page);
    await homePage.goto();
  });

  test('deve exibir o seletor de idiomas', async () => {
    // Verificar se os botões de idioma estão presentes e visíveis
    await expect(homePage.languageSelector.english).toBeVisible();
    await expect(homePage.languageSelector.portuguese).toBeVisible();
    await expect(homePage.languageSelector.spanish).toBeVisible();
  });

  test('deve permitir alterar o idioma', async ({ page }) => {
    // Mudar para Português
    await homePage.changeLanguage('pt');
    
    // Verificar se o texto está em português
    await homePage.expectTextsInLanguage('pt');
    
    // Mudar para Espanhol
    await homePage.changeLanguage('es');
    
    // Verificar se o texto está em espanhol
    await homePage.expectTextsInLanguage('es');
    
    // Voltar para Inglês
    await homePage.changeLanguage('en');
    
    // Verificar se o texto está em inglês
    await homePage.expectTextsInLanguage('en');
  });

  test('deve exibir textos correspondentes ao idioma selecionado', async ({ page }) => {
    // Testar cada idioma
    const languages = [
      { code: 'en', expectedSubtitle: 'Software Engineering' },
      { code: 'pt', expectedSubtitle: 'Engenharia de Software' },
      { code: 'es', expectedSubtitle: 'Ingeniería de Software' }
    ];
    
    for (const lang of languages) {
      // Mudar para o idioma
      await homePage.changeLanguage(lang.code as 'en' | 'pt' | 'es');
      
      // Usar a função verifySubtitle para verificações mais resilientes
      await homePage.verifySubtitle(lang.expectedSubtitle);
    }
  });

  test('deve manter a preferência de idioma entre recarregamentos', async ({ page }) => {
    // Mudar para Português
    await homePage.changeLanguage('pt');
    
    // Verificar se o texto está em português antes do recarregamento
    await homePage.verifySubtitle('Engenharia de Software');
    
    // Recarregar a página
    await page.reload();
    
    // Esperar a página carregar completamente
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="subtitle"]', { state: 'visible', timeout: 15000 });
    
    // Verificar se o texto ainda está em português com verificação resiliente
    await homePage.verifySubtitle('Engenharia de Software', 5); // Tentativas extras após reload
  });
  
  // Use test.skip a nível de teste para pular no WebKit
  test('deve ter elementos de idioma acessíveis', { 
    // Pular teste apenas no WebKit
    skip: ({ browserName }) => browserName === 'webkit'
  }, async ({ page }) => {
    // Verificar se os botões de idioma são acessíveis
    await a11y.expectElementAccessible(homePage.languageSelector.english, {
      label: 'English'
    });
    await a11y.expectElementAccessible(homePage.languageSelector.portuguese, {
      label: 'Português'
    });
    await a11y.expectElementAccessible(homePage.languageSelector.spanish, {
      label: 'Español'
    });
    
    // Verificar navegabilidade por teclado
    await a11y.expectKeyboardNavigable();
  });
});