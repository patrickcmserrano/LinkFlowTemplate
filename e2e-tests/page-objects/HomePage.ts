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
    // Usando data-testid para o subtítulo para maior estabilidade
    this.subtitle = page.getByTestId('subtitle');
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
   * Alterna o idioma da aplicação com foco e verificação rigorosa
   * Método otimizado para lidar com problemas de foco no WebKit
   */
  async changeLanguage(language: 'en' | 'pt' | 'es', browserName?: string) {
    // Mapeia as strings de idioma para os localizadores de botões
    const languageMap = {
      'en': this.languageSelector.english,
      'pt': this.languageSelector.portuguese,
      'es': this.languageSelector.spanish
    };
    
    const button = languageMap[language];
    const initialText = await this.subtitle.textContent();

    // Foco explícito antes do clique
    await button.focus();
    await button.click();
    
    // Espera combinada com fallback
    await Promise.race([
      this.page.waitForFunction(
        (expectedText, testId) => {
          const element = document.querySelector(`[data-testid="${testId}"]`);
          return element?.textContent !== expectedText;
        },
        { timeout: 15000 },
        initialText,
        'subtitle'
      ),
      this.page.waitForTimeout(1000) // Fallback seguro
    ]);

    // Verificação adicional para WebKit
    const isWebKit = browserName === 'webkit' || 
                    (this.page.context().browser()?.browserType().name().includes('webkit'));
    
    if (isWebKit) {
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(200);
      
      // Re-aplicar foco no WebKit
      try {
        await button.evaluate(el => el.focus());
      } catch (e) {
        console.warn('Não foi possível re-focar o botão no WebKit', e);
      }
    }
    
    const expectedTexts = {
      en: 'Software Engineering',
      pt: 'Engenharia de Software',
      es: 'Ingeniería de Software'
    };
    
    // Verificação final do texto
    await expect(this.subtitle).toHaveText(expectedTexts[language], { 
      timeout: 10000 
    });
  }
  
  /**
   * Verifica o texto do subtítulo para um idioma específico
   * @param language Código do idioma
   */
  async verifySubtitleText(language: 'en' | 'pt' | 'es') {
    const expectedTexts = {
      en: 'Software Engineering',
      pt: 'Engenharia de Software',
      es: 'Ingeniería de Software'
    };
    
    await expect(this.subtitle).toHaveText(expectedTexts[language], { 
      timeout: 10000 
    });
    
    return true;
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
    await expect(this.subtitle).toBeVisible({ timeout: 10000 });
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

  /**
   * Verifica o subtítulo com múltiplas tentativas
   * @param expectedText Texto esperado
   * @param attempts Número de tentativas
   * @returns true se o texto corresponder, lança erro caso contrário
   */
  async verifySubtitle(expectedText: string, attempts = 3) {
    console.log(`Verificando subtítulo com texto "${expectedText}" (${attempts} tentativas)...`);
    
    for (let i = 0; i < attempts; i++) {
      const actualText = await this.subtitle.textContent();
      console.log(`Tentativa ${i+1}/${attempts}: Texto atual = "${actualText}"`);
      
      if (actualText.includes(expectedText)) {
        console.log(`✓ Texto corresponde na tentativa ${i+1}`);
        return true;
      }
      
      // Apenas aguarde e tente novamente se não for a última tentativa
      if (i < attempts - 1) {
        console.log(`Texto não corresponde, aguardando 1s antes da próxima tentativa...`);
        await this.page.waitForTimeout(1000);
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    const finalText = await this.subtitle.textContent();
    const errorMsg = `Texto do subtítulo não corresponde após ${attempts} tentativas. Atual: "${finalText}", Esperado: contém "${expectedText}"`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}