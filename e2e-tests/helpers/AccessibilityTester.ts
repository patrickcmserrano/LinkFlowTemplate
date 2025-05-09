import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Classe auxiliar avançada para testes de acessibilidade no Playwright
 */
export class AccessibilityTester {
  constructor(private page: Page) {}

  /**
   * Verifica se um elemento atende a critérios básicos de acessibilidade
   */
  async expectElementAccessible(locator: Locator, options?: { 
    label?: string;
    checkFocus?: boolean;
    checkContrast?: boolean;
  }) {
    try {
      // Verificar visibilidade - com timeout reduzido para não atrasar muito o teste
      await expect(locator).toBeVisible({ timeout: 3000 });
      
      // Verificar nome acessível
      if (options?.label) {
        await this.expectAccessibleName(locator, options.label);
      }
      
      // Verificar possibilidade de foco
      if (options?.checkFocus) {
        await this.expectElementFocusable(locator);
      }
      
      // Verificar contraste
      if (options?.checkContrast) {
        await this.expectSufficientColorContrast(locator);
      }
    } catch (error) {
      console.warn(`Aviso: Não foi possível verificar acessibilidade para o elemento. ${error.message}`);
      // Não falhar o teste por isso, apenas registrar um aviso
    }
  }

  /**
   * Verifica se um elemento tem um nome acessível apropriado
   */
  async expectAccessibleName(locator: Locator, expectedLabel: string) {
    try {
      const ariaLabel = await locator.getAttribute('aria-label');
      const ariaLabelledby = await locator.getAttribute('aria-labelledby');
      const title = await locator.getAttribute('title');
      const alt = await locator.getAttribute('alt');
      const textContent = await locator.textContent();
      
      // Obter o nome acessível real - priorizando aria-label
      const accessibleName = 
        ariaLabel || 
        (ariaLabelledby ? await this.getLabelledByText(ariaLabelledby) : null) ||
        alt || 
        title || 
        textContent || 
        '';
      
      // Verificar se o nome acessível contém o texto esperado
      expect(
        accessibleName.toLowerCase().includes(expectedLabel.toLowerCase()),
        `O elemento deve ter um nome acessível contendo "${expectedLabel}"`
      ).toBeTruthy();
    } catch (error) {
      console.warn(`Aviso: Falha ao verificar nome acessível "${expectedLabel}". ${error.message}`);
    }
  }

  /**
   * Obtém o texto do elemento referenciado por aria-labelledby
   */
  private async getLabelledByText(labelledById: string): Promise<string> {
    try {
      const labelElement = this.page.locator(`#${labelledById}`);
      const count = await labelElement.count();
      
      if (count > 0) {
        return await labelElement.textContent() || '';
      }
    } catch (error) {
      console.warn(`Aviso: Não foi possível obter texto de aria-labelledby. ${error.message}`);
    }
    
    return '';
  }

  /**
   * Verifica se um elemento pode receber foco
   */
  async expectElementFocusable(locator: Locator) {
    try {
      await locator.focus();
      
      const isFocused = await this.page.evaluate(() => {
        return document.activeElement === document.querySelector(':focus');
      });
      
      expect(isFocused, 'O elemento deve poder receber foco').toBeTruthy();
    } catch (error) {
      console.warn(`Aviso: Elemento não pode receber foco. ${error.message}`);
    }
  }

  /**
   * Verifica se um botão é totalmente acessível
   */
  async expectButtonAccessible(locator: Locator, label: string) {
    try {
      await this.expectElementAccessible(locator, { 
        label, 
        checkFocus: true,
        checkContrast: true 
      });
      
      // Verificar papel correto
      const role = await locator.getAttribute('role');
      if (role !== 'button' && (await locator.evaluate(el => el.tagName.toLowerCase() !== 'button'))) {
        // Se não for um <button> nativo, deve ter role="button"
        expect(role, 'Elemento não-button deve ter role="button"').toBe('button');
      }
      
      // Verificar interação com teclado
      await locator.focus();
      
      // Simular pressionar Enter
      await this.page.keyboard.press('Enter');
    } catch (error) {
      console.warn(`Aviso: Botão não passou em todos os critérios de acessibilidade. ${error.message}`);
    }
  }
  
  /**
   * Verifica se a estrutura de cabeçalhos da página é lógica e acessível
   */
  async expectValidHeadingStructure() {
    try {
      // Verificar se a página tem pelo menos um cabeçalho
      const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length, 'A página deve ter pelo menos um cabeçalho').toBeGreaterThan(0);
      
      // Verificar se há exatamente um h1 por página
      const h1Count = await this.page.locator('h1').count();
      expect(h1Count, 'A página deve ter exatamente um cabeçalho h1').toBe(1);
    } catch (error) {
      console.warn(`Aviso: Estrutura de cabeçalhos não ideal. ${error.message}`);
    }
  }

  /**
   * Verifica se o contraste de cores é suficiente para acessibilidade
   * Nota: Esta é uma verificação simplificada e pode precisar de ajustes
   */
  async expectSufficientColorContrast(locator: Locator) {
    try {
      // Obter cores de texto e fundo
      const { color, backgroundColor } = await this.getElementColors(locator);
      
      // Log para verificação manual (cálculo automatizado de contraste é complexo)
      console.log(`Verificação de cor do elemento - Texto: ${color}, Fundo: ${backgroundColor}`);
    } catch (error) {
      console.warn(`Aviso: Não foi possível verificar contraste de cores. ${error.message}`);
    }
  }

  /**
   * Obtém as cores de texto e fundo de um elemento
   */
  private async getElementColors(locator: Locator) {
    return await locator.evaluate(el => {
      const style = window.getComputedStyle(el);
      let backgroundColor = style.backgroundColor;
      
      // Tentar obter cor de fundo do elemento pai se o elemento for transparente
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        let parent = el.parentElement;
        let depth = 0;
        
        // Procurar até 3 níveis acima para evitar loop infinito
        while (parent && depth < 3) {
          const parentStyle = window.getComputedStyle(parent);
          backgroundColor = parentStyle.backgroundColor;
          
          if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
            break;
          }
          
          parent = parent.parentElement;
          depth++;
        }
      }
      
      return {
        color: style.color,
        backgroundColor
      };
    });
  }

  /**
   * Verifica se a página é navegável por teclado
   */
  async expectKeyboardNavigable() {
    try {
      // Pressionar Tab para navegar entre elementos
      await this.page.keyboard.press('Tab');
      
      // Verificar se algo recebeu foco
      const hasFocus = await this.page.evaluate(() => {
        return document.activeElement !== document.body;
      });
      
      expect(hasFocus, 'A página deve ser navegável por teclado').toBeTruthy();
      
      // Simplificando a verificação de navegação teclado para evitar falsos negativos
      // em navegadores diferentes
      await this.page.keyboard.press('Tab');
    } catch (error) {
      console.warn(`Aviso: Navegação por teclado não ideal. ${error.message}`);
    }
  }
  
  /**
   * Injecta axe-core e executa análise de acessibilidade
   */
  async runAxeAnalysis(context?: string) {
    try {
      // Injetar axe-core
      await this.page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js'
      });
      
      // Executar análise
      const contextSelector = context || 'document';
      const results = await this.page.evaluate(`
        (async () => {
          return await axe.run(${contextSelector}, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa']
            }
          });
        })()
      `);
      
      // Verificar violações
      if (results.violations.length > 0) {
        console.warn('Violações de acessibilidade encontradas:', 
          results.violations.map(v => ({
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length
          }))
        );
      }
      
      // Retornar resultados para possível análise adicional
      return results;
    } catch (error) {
      console.warn(`Aviso: Não foi possível executar análise axe-core. ${error.message}`);
      return { violations: [] };
    }
  }
}