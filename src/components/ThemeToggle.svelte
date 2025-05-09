<script lang="ts">
  import { onMount } from 'svelte';

  let isDarkMode = $state(false);

  onMount(() => {
    // Sincroniza o estado do toggle com o modo atual do tema
    const storedMode = localStorage.getItem('mode') || 'light';
    isDarkMode = storedMode === 'dark';
    
    // Garante que o tema inicial seja aplicado
    document.documentElement.setAttribute('data-mode', storedMode);
  });

  function handleThemeChange() {
    isDarkMode = !isDarkMode;
    const mode = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
  }

  // Garante que o componente exporte algo
  export {};
</script>

<svelte:head>
  <script>
    // Aplicar tema salvo no carregamento da página
    const mode = localStorage.getItem('mode') || 'light';
    document.documentElement.setAttribute('data-mode', mode);
  </script>
</svelte:head>

<div class="theme-toggle-container">
  <button 
    type="button"
    class="theme-toggle"
    id="theme-toggle"
    aria-pressed={isDarkMode}
    aria-label="Alternar tema claro/escuro"
    onclick={handleThemeChange}
  >
    <span class="icon">
      {#if isDarkMode}
        <!-- Sol -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      {:else}
        <!-- Lua -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      {/if}
    </span>
  </button>
</div>

<style>
  /* 
   * A classe sr-only está sendo usada por outros componentes,
   * mantida aqui para referência e possível uso futuro
   */
  .theme-toggle-container {
    display: flex;
    align-items: center;
  }
  
  .theme-toggle {
    background: transparent;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-color, #333);
  }
  
  :global(.dark) .theme-toggle {
    border-color: var(--dark-border, #555);
    color: var(--dark-text, #eee);
  }
  
  .theme-toggle:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark) .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>