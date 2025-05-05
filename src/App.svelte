<script lang="ts">
  import './styles/global.css';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import LanguageSelector from './components/LanguageSelector.svelte';
  import Section from './components/Section.svelte';
  import { _ } from './lib/i18n';
  import { onMount } from 'svelte';
  import { Link } from '@lucide/svelte';

  // Inicializa o suporte a idiomas
  import { i18n } from './lib/i18n';
  i18n.initialize();

  // Carrega os dados do arquivo links.json
  import linksData from './data/links.json';
  
  let profile = linksData.profile;
  let sections = linksData.sections;
  
  // Função para ajustar caminhos de imagens com o caminho base
  const getImagePath = (path) => {
    // Remover a barra inicial se existir
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return import.meta.env.BASE_URL + cleanPath;
  };
</script>

<main class="min-h-screen max-w-md mx-auto px-4 py-6 space-y-6">
  <div class="flex justify-between items-center mb-8">
    <div class="language-selector">
      <LanguageSelector />
    </div>
    <div class="theme-toggle">
      <ThemeToggle />
    </div>
  </div>
  
  <div class="profile text-center mb-8">
    <div class="avatar-container mx-auto w-20 h-20 rounded-full overflow-hidden mb-4">
      <img src={getImagePath(profile.avatar)} alt={profile.name} class="w-full h-full object-cover" />
    </div>
    <div class="flex items-center justify-center gap-2 mb-2">
      <Link size={24} class="text-blue-500" />
      <h1 class="h1 text-2xl font-bold">{$_('app.title')}</h1>
    </div>
    <p class="text-base opacity-80 max-w-xs mx-auto">{$_('app.subtitle')}</p>
  </div>
  
  <div class="sections space-y-4">
    {#each sections as section}
      <Section 
        name={section.name} 
        color={section.color} 
        links={section.links.map(link => ({
          ...link,
          icon: getImagePath(link.icon)
        }))}
      />
    {/each}
  </div>
  
  <footer class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">{$_('footer.copyright')}</p>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Roboto', system-ui, sans-serif;
  }
  
  @media (max-width: 768px) {
    main {
      width: 100%;
      padding: 1rem;
    }
  }
</style>
