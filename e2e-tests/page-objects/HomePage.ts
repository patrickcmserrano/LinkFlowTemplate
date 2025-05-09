import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object representando a Home Page do LinkFlow
 */
export class HomePage {
  // Elementos principais
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly themeToggle: Locator;
  
  // Seletores de idioma
  readonly languageSelector: {
    english: Locator;
    portuguese: Locator;
    spanish: Locator;
  };
  
  // Seções de links
  readonly sections: {
    projects: Locator;
    social: Locator;
  };
  
  // Links comuns
  readonly links: {
    portfolio: Locator;
    github: Locator;
    linkedin: Locator;
  };
  
  constructor(page: Page) {
    this.page = page;
    
    // Elementos principais
    this.heading = page.getByRole('heading', { level: 1 });
    // Usando localizador menos específico para o subtítulo
    this.subtitle = page.locator('.subtitle');
    this.themeToggle = page.getByRole('button', { name: /tema/i });
    
    // Seletores de idioma
    this.languageSelector = {
      english: page.getByRole('button', { name: 'English' }),
      portuguese: page.getByRole('button', { name: 'Português' }),
      spanish: page.getByRole('button', { name: 'Español' })
    };
    
    // Seções
    this.sections = {
      projects: page.locator('h2', { hasText: 'Projetos' }).first(),
      social: page.locator('h2', { hasText: 'Redes Sociais' }).first()
    };
    
    // Links - usando localizadores mais robustos
    this.links = {
      portfolio: page.locator('a', { hasText: 'Portfólio' }),
      github: page.locator('a', { hasText: 'GitHub' }),
      linkedin: page.locator('a', { hasText: 'LinkedIn' })
    };
  }
  
  /**
   * Navega para a Home Page
   */
  async goto() {
    await this.page.goto('/');
    // Aguardar a página carregar completamente
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Alterna o idioma da aplicação
   */
  async changeLanguage(language: 'en' | 'pt' | 'es') {
    switch (language) {
      case 'en':
        await this.languageSelector.english.click();
        break;
      case 'pt':
        await this.languageSelector.portuguese.click();
        break;
      case 'es':
        await this.languageSelector.spanish.click();
        break;
    }
    
    // Aumentar o tempo de espera para garantir que a mudança de idioma seja aplicada
    await this.page.waitForTimeout(1000);
  }
  
  /**
   * Colapsa ou expande uma seção
   */
  async toggleSection(section: 'projects' | 'social') {
    if (section === 'projects') {
      await this.sections.projects.click();
      // Aguardar a animação de colapso/expansão
      await this.page.waitForTimeout(500);
    } else {
      await this.sections.social.click();
      // Aguardar a animação de colapso/expansão
      await this.page.waitForTimeout(500);
    }
  }
  
  /**
   * Verifica se os textos estão no idioma correto
   */
  async expectTextsInLanguage(language: 'en' | 'pt' | 'es') {
    const expectedTexts = {
      en: {
        subtitle: 'Software Engineering'
      },
      pt: {
        subtitle: 'Engenharia de Software'
      },
      es: {
        subtitle: 'Ingeniería de Software'
      }
    };
    
    // Mudança para usar o localizador .subtitle em vez de texto exato
    await expect(this.subtitle).toBeVisible();
    const subtitleText = await this.subtitle.textContent();
    expect(subtitleText).toContain(expectedTexts[language].subtitle);
  }
  
  /**
   * Verifica se todas as seções de links estão visíveis
   */
  async expectAllSectionsVisible() {
    await expect(this.sections.projects).toBeVisible();
    await expect(this.sections.social).toBeVisible();
  }

  /**
   * Verifica se um link específico está visível
   */
  async expectLinkVisible(linkName: 'portfolio' | 'github' | 'linkedin', shouldBeVisible: boolean = true) {
    const link = this.links[linkName];
    if (shouldBeVisible) {
      await expect(link).toBeVisible();
    } else {
      await expect(link).not.toBeVisible();
    }
  }
}