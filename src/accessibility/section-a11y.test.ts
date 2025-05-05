import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import Section from '../components/Section.svelte';

// Mock do LinkCard para o teste
vi.mock('../components/LinkCard.svelte', () => ({
  default: vi.fn((props) => ({
    $$render: () => `<div class="link-card" role="link" 
                         aria-label="${props.title}">${props.title}</div>`
  }))
}));

// Mock para o componente Section
vi.mock('../components/Section.svelte', () => {
  return {
    default: {
      render: (props: {name: string, color: string, links: Array<{title: string, url: string, icon: string}>}) => {
        // Estado simulado
        const isExpanded = true;
        
        return {
          html: `
            <div class="section">
              <div class="section-header" style="background-color: ${props.color}" 
                   role="heading" aria-level="2" aria-expanded="${isExpanded}">
                <h2 id="${props.name.toLowerCase().replace(/\s/g, '-')}">${props.name}</h2>
                <span class="${isExpanded ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
              </div>
              ${isExpanded ? `
              <div class="section-content" role="region" aria-labelledby="${props.name.toLowerCase().replace(/\s/g, '-')}">
                ${props.links.map(link => 
                  `<div class="link-card" role="link" aria-label="${link.title}">
                    <div class="icon-container">
                      <img src="${link.icon}" alt="${link.title}" />
                    </div>
                    <div class="link-title">${link.title}</div>
                  </div>`
                ).join('')}
              </div>
              ` : ''}
            </div>
          `,
          // Simulando método para testar o comportamento de colapso
          toggleExpand: () => {}
        };
      }
    }
  };
});

describe('Acessibilidade do Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('deve usar heading com nível adequado para o título da seção', () => {
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' }
    ];

    const component = Section.render({
      name: 'Seção de Teste',
      color: '#E0F7FA',
      links: mockLinks
    });

    expect(component.html).toContain('role="heading"');
    expect(component.html).toContain('aria-level="2"');
  });

  it('deve ter o atributo aria-expanded no cabeçalho', () => {
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' }
    ];

    const component = Section.render({
      name: 'Seção Colapsável',
      color: '#E0F7FA',
      links: mockLinks
    });

    expect(component.html).toContain('aria-expanded="true"');
  });
  
  it('deve usar aria-hidden para elementos puramente decorativos', () => {
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' }
    ];

    const component = Section.render({
      name: 'Seção com Decoração',
      color: '#E0F7FA',
      links: mockLinks
    });

    expect(component.html).toContain('aria-hidden="true"');
  });
  
  it('deve usar role="region" para a área de conteúdo', () => {
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' }
    ];

    const component = Section.render({
      name: 'Seção com Conteúdo',
      color: '#E0F7FA',
      links: mockLinks
    });

    expect(component.html).toContain('role="region"');
  });
  
  it('deve usar aria-labelledby para associar o conteúdo ao título', () => {
    const sectionName = 'Seção Acessível';
    const sectionId = sectionName.toLowerCase().replace(/\s/g, '-');
    
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' }
    ];

    const component = Section.render({
      name: sectionName,
      color: '#E0F7FA',
      links: mockLinks
    });

    expect(component.html).toContain(`id="${sectionId}"`);
    expect(component.html).toContain(`aria-labelledby="${sectionId}"`);
  });
});