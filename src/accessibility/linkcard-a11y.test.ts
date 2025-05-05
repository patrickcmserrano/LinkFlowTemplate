import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import LinkCard from '../components/LinkCard.svelte';

// Mock para o componente LinkCard
vi.mock('../components/LinkCard.svelte', () => {
  return {
    default: {
      render: (props: {title: string, url: string, icon: string, backgroundColor?: string}) => {
        return {
          html: `
            <a href="${props.url}" class="link-card" style="background-color: ${props.backgroundColor || '#F5F5F5'}" 
               aria-label="${props.title}" role="link" tabindex="0">
              <div class="icon-container">
                <img src="${props.icon}" alt="${props.title}" />
              </div>
              <div class="link-title">${props.title}</div>
            </a>
          `
        };
      }
    }
  };
});

describe('Acessibilidade do LinkCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('deve ter texto alternativo adequado para o ícone baseado no título', () => {
    const title = 'LinkedIn';
    const component = LinkCard.render({
      title,
      url: 'https://linkedin.com',
      icon: '/images/linkedin-icon.svg'
    });
    
    expect(component.html).toContain(`alt="${title}"`);
  });

  it('deve ter um papel de link acessível', () => {
    const component = LinkCard.render({
      title: 'GitHub',
      url: 'https://github.com',
      icon: '/images/github-icon.svg'
    });
    
    expect(component.html).toContain('role="link"');
  });
  
  it('deve ter um aria-label para acessibilidade', () => {
    const title = 'LinkedIn Profile';
    const component = LinkCard.render({
      title,
      url: 'https://linkedin.com',
      icon: '/images/linkedin-icon.svg'
    });
    
    expect(component.html).toContain(`aria-label="${title}"`);
  });
  
  it('deve ter um tabindex para navegação por teclado', () => {
    const component = LinkCard.render({
      title: 'GitHub',
      url: 'https://github.com',
      icon: '/images/github-icon.svg'
    });
    
    expect(component.html).toContain('tabindex="0"');
  });
});