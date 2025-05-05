<script lang="ts">
  import { writable } from 'svelte/store';
  import LinkCard from './LinkCard.svelte';
  
  export let name: string;
  export let color: string;
  export let links: Array<{ title: string; url: string; icon: string; }>;
  
  // Store para controlar o estado de expansão/colapso
  const isExpanded = writable(true);
  
  function toggleExpand() {
    isExpanded.update(value => !value);
  }

  // Função para ajustar a cor com base no modo do tema
  function getThemeAwareColor() {
    // Verifica se estamos no modo escuro
    const isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark';
    if (isDarkMode) {
      // Escurece a cor para o modo escuro
      return darkModeColor(color);
    }
    return color;
  }

  // Função para escurecer cores para o modo escuro
  function darkModeColor(colorString: string) {
    // Tenta converter para um objeto de cor para manipulação
    try {
      // Se for uma cor RGB no formato rgb(r, g, b)
      if (colorString.startsWith('rgb')) {
        const rgbValues = colorString.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          const [r, g, b] = rgbValues.map(Number);
          // Escurecer a cor (reduzir a luminosidade)
          const darkR = Math.floor(r * 0.5);
          const darkG = Math.floor(g * 0.5);
          const darkB = Math.floor(b * 0.5);
          return `rgb(${darkR}, ${darkG}, ${darkB})`;
        }
      }
      // Se for uma cor HEX no formato #RRGGBB
      else if (colorString.startsWith('#')) {
        const r = parseInt(colorString.slice(1, 3), 16);
        const g = parseInt(colorString.slice(3, 5), 16);
        const b = parseInt(colorString.slice(5, 7), 16);
        // Escurecer a cor (reduzir a luminosidade)
        const darkR = Math.floor(r * 0.5).toString(16).padStart(2, '0');
        const darkG = Math.floor(g * 0.5).toString(16).padStart(2, '0');
        const darkB = Math.floor(b * 0.5).toString(16).padStart(2, '0');
        return `#${darkR}${darkG}${darkB}`;
      }
    } catch (e) {
      console.error("Erro ao processar cor:", e);
    }
    
    // Fallback para uma cor escura segura se algo der errado
    return "#1e293b";
  }

  // Cor de fundo para o content, com transparência
  function getContentBackgroundColor() {
    const isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark';
    if (isDarkMode) {
      return "rgba(24, 24, 27, 0.7)"; // Cor escura com transparência
    }
    return `${color}33`; // Mantém o comportamento original com transparência
  }
</script>

<div class="section mb-6 rounded-lg overflow-hidden">
  <div 
    class="section-header p-4 cursor-pointer flex justify-between items-center" 
    style="background-color: {getThemeAwareColor()}"
    on:click={toggleExpand}
    on:keydown={(e) => e.key === 'Enter' && toggleExpand()}
    tabindex="0"
    role="button"
    aria-expanded={$isExpanded}
  >
    <h2 class="text-lg font-bold">{name}</h2>
    <span class="transform transition-transform {$isExpanded ? 'rotate-180' : ''}">▼</span>
  </div>
  
  {#if $isExpanded}
    <div class="section-content p-4 flex flex-col gap-4" style="background-color: {getContentBackgroundColor()}">
      {#each links as link}
        <LinkCard 
          title={link.title} 
          url={link.url} 
          icon={link.icon} 
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .section {
    transition: all 0.3s ease;
  }
  
  .section-header {
    user-select: none;
    color: white; /* Garantir boa legibilidade no cabeçalho colorido */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  :global([data-mode="dark"]) .section-content {
    background-color: rgba(40, 40, 45, 0.7) !important;
  }
</style>