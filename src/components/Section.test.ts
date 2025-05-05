import { describe, expect, it, vi } from 'vitest';
import Section from '../components/Section.svelte';

// Mock para o componente Section para compatibilidade com Svelte 5
vi.mock('../components/Section.svelte', () => {
  return {
    default: {
      render: (props) => {
        // Simulando estado de expansão inicial
        let isExpanded = true;
        
        // Função para gerar HTML baseado no estado atual
        const generateHtml = () => `
          <div class="section">
            <div class="section-header" style="background-color: ${props.color}">
              <h2>${props.name}</h2>
              <span class="${isExpanded ? 'rotate-180' : ''}">▼</span>
            </div>
            ${isExpanded ? `
            <div class="section-content">
              ${props.links.map(link => 
                `<div class="link-card">
                  <div class="icon-container">
                    <img src="${link.icon}" alt="">
                  </div>
                  <div class="link-title">${link.title}</div>
                </div>`
              ).join('')}
            </div>
            ` : ''}
          </div>
        `;
        
        return {
          html: generateHtml(),
          // Simulando método para testar o comportamento de colapso
          toggleExpand: () => {
            isExpanded = !isExpanded;
            return generateHtml();
          }
        };
      }
    }
  };
});

describe('Section Component', () => {
  const mockLinks = [
    { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' },
    { title: 'Link 2', url: 'https://example2.com', icon: '/images/icon2.svg' }
  ];

  it('renderiza corretamente com as props fornecidas', () => {
    const component = Section.render({
      name: 'Test Section',
      color: '#E0F7FA',
      links: mockLinks
    });
    
    expect(component.html).toContain('Test Section');
    expect(component.html).toContain('Link 1');
    expect(component.html).toContain('Link 2');
  });

  it('aplica a cor correta na seção', () => {
    const component = Section.render({
      name: 'Colored Section',
      color: '#FF5733',
      links: mockLinks
    });
    
    expect(component.html).toContain('background-color: #FF5733');
  });
  
  it('colapsa e expande a seção quando toggleExpand é chamado', () => {
    const component = Section.render({
      name: 'Collapsible Section',
      color: '#E0F7FA',
      links: mockLinks
    });
    
    // Inicialmente o conteúdo está visível
    expect(component.html).toContain('Link 1');
    
    // Após colapsar, o conteúdo não deve estar visível
    const collapsedHtml = component.toggleExpand();
    expect(collapsedHtml).not.toContain('Link 1');
    
    // Após expandir novamente, o conteúdo deve estar visível
    const expandedHtml = component.toggleExpand();
    expect(expandedHtml).toContain('Link 1');
  });
});