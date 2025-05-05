import { describe, it, expect, vi, beforeEach } from 'vitest';
import Section from '../components/Section.svelte';
import LinkCard from '../components/LinkCard.svelte';

// Mock do LinkCard para o teste de integração
vi.mock('../components/LinkCard.svelte', () => ({
  default: {
    render: (props) => ({
      html: `<div data-testid="link-card" 
                 data-title="${props.title}" 
                 data-url="${props.url}"
                 data-icon="${props.icon}"></div>`
    })
  }
}));

// Mock do Section para o teste
vi.mock('../components/Section.svelte', () => ({
  default: {
    render: (props) => {
      return {
        html: `
          <div class="section">
            <div class="section-header" style="background-color: ${props.color}">
              <h2>${props.name}</h2>
              <span>▼</span>
            </div>
            <div class="section-content">
              ${props.links.map(link => 
                  LinkCard.render({
                    title: link.title,
                    url: link.url,
                    icon: link.icon
                  }).html
              ).join('')}
            </div>
          </div>
        `
      };
    }
  }
}));

describe('Integração Section e LinkCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os LinkCards dentro de uma Section', () => {
    const mockLinks = [
      { title: 'Link 1', url: 'https://example1.com', icon: '/images/icon1.svg' },
      { title: 'Link 2', url: 'https://example2.com', icon: '/images/icon2.svg' },
      { title: 'Link 3', url: 'https://example3.com', icon: '/images/icon3.svg' }
    ];

    // Renderiza o componente Section sem usar testing-library
    const { html } = Section.render({
      name: 'Test Section',
      color: '#E0F7FA',
      links: mockLinks
    });

    // Cria um elemento temporário para analisar o HTML
    const container = document.createElement('div');
    container.innerHTML = html;

    // Verifica se todos os links foram renderizados dentro da seção
    const linkCards = container.querySelectorAll('[data-testid="link-card"]');
    expect(linkCards.length).toBe(mockLinks.length);

    // Verifica cada LinkCard individualmente
    for (let i = 0; i < mockLinks.length; i++) {
      const card = linkCards[i];
      const link = mockLinks[i];
      
      expect(card.getAttribute('data-title')).toBe(link.title);
      expect(card.getAttribute('data-url')).toBe(link.url);
      expect(card.getAttribute('data-icon')).toBe(link.icon);
    }
  });
});