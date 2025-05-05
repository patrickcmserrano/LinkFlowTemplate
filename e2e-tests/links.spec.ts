import { test, expect } from '@playwright/test';

test.describe('LinkFlow - Funcionalidade de Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir todas as seções de links', async ({ page }) => {
    // Verifica se o título da página está correto
    await expect(page).toHaveTitle(/LinkFlow/);
    
    // Verificar que a página carregou corretamente - não procure pelo texto exato "LinkFlow"
    // mas sim por elementos que sabemos que existem
    await expect(page.locator('h1')).toBeVisible();
    
    // Verifica se as seções estão visíveis
    await expect(page.getByText('Projetos')).toBeVisible();
    await expect(page.getByText('Redes Sociais')).toBeVisible();
  });

  test('deve ser possível colapsar e expandir seções', async ({ page }) => {
    // Encontra os cabeçalhos das seções
    const projetosHeader = page.getByText('Projetos').first();
    
    // Colapsa a seção de Projetos
    await projetosHeader.click();
    
    // Verifica se o link "Portfólio" não está visível após colapsar
    await expect(page.getByText('Portfólio')).not.toBeVisible();
    
    // Expande a seção novamente
    await projetosHeader.click();
    
    // Verifica se o link está visível novamente
    await expect(page.getByText('Portfólio')).toBeVisible();
  });

  test('verifica se os links têm atributos target="_blank"', async ({ page }) => {
    // Verifica se o link do LinkedIn abre em uma nova aba - usando o seletor correto para o elemento <a>
    const linkedinLink = page.locator('a', { hasText: 'LinkedIn' });
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    
    // Verifica se o link do GitHub abre em uma nova aba - usando o seletor correto para o elemento <a>
    const githubLink = page.locator('a', { hasText: 'GitHub' });
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });
});