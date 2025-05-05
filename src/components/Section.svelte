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
</script>

<div class="section mb-6 rounded-lg overflow-hidden">
  <div 
    class="section-header p-4 cursor-pointer flex justify-between items-center" 
    style:background-color={color}
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
    <div class="section-content p-4 flex flex-col gap-4 bg-opacity-30" style:background-color={`${color}33`}>
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
  }
</style>