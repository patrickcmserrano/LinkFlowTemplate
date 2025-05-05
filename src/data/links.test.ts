import { describe, it, expect } from 'vitest';
import links from './links.json';

describe('Links Data', () => {
  it('deve ter a estrutura de dados correta para o perfil', () => {
    expect(links).toHaveProperty('profile');
    expect(links.profile).toHaveProperty('name');
    expect(links.profile).toHaveProperty('title');
    expect(links.profile).toHaveProperty('avatar');
    
    // Verifica tipos de dados do perfil
    expect(typeof links.profile.name).toBe('string');
    expect(typeof links.profile.title).toBe('string');
    expect(typeof links.profile.avatar).toBe('string');
  });

  it('deve ter seções com estrutura adequada', () => {
    expect(links).toHaveProperty('sections');
    expect(Array.isArray(links.sections)).toBe(true);
    expect(links.sections.length).toBeGreaterThan(0);
    
    // Verifica cada seção
    links.sections.forEach(section => {
      expect(section).toHaveProperty('name');
      expect(section).toHaveProperty('color');
      expect(section).toHaveProperty('links');
      expect(Array.isArray(section.links)).toBe(true);
      expect(section.links.length).toBeGreaterThan(0);
      
      // Verifica a formatação de cores (deve ser um formato HEX válido)
      expect(section.color).toMatch(/^#([0-9A-F]{3}){1,2}$/i);
    });
  });

  it('deve ter links com todas as propriedades necessárias', () => {
    // Verifica cada link em todas as seções
    links.sections.forEach(section => {
      section.links.forEach(link => {
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('url');
        expect(link).toHaveProperty('icon');
        
        // Verifica tipos de dados dos links
        expect(typeof link.title).toBe('string');
        expect(typeof link.url).toBe('string');
        expect(typeof link.icon).toBe('string');
        
        // Verifica se o URL é válido
        expect(() => new URL(link.url)).not.toThrow();
      });
    });
  });
  
  it('deve ter caminhos de ícones existentes', () => {
    const iconPaths = new Set();
    
    // Coleta todos os caminhos de ícones
    links.sections.forEach(section => {
      section.links.forEach(link => {
        iconPaths.add(link.icon);
      });
    });
    
    // Verifica se cada ícone segue um padrão esperado
    iconPaths.forEach(path => {
      expect(typeof path).toBe('string');
      expect(path).toMatch(/^\/images\/.*\.(svg|png|jpg|jpeg|gif)$/i);
    });
  });
});