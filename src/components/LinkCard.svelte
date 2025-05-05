<script lang="ts">
  export let title: string;
  export let url: string;
  export let icon: string;
  export let backgroundColor: string = "#F5F5F5";
</script>

<a 
  href={url} 
  target="_blank" 
  rel="noopener noreferrer"
  class="link-card rounded-lg p-3 flex items-center gap-3 transition-transform hover:scale-105 focus:scale-105"
  style:background-color={backgroundColor}
>
  <div class="icon-container w-11 h-11 flex-shrink-0 flex items-center justify-center">
    <img src={icon} alt="" class="w-full h-full object-contain" loading="lazy" />
  </div>
  <div class="link-title text-center flex-grow font-medium">
    {title}
  </div>
</a>

<style>
  .link-card {
    min-height: 44px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-family: 'Inter', 'Roboto', sans-serif;
  }

  :global([data-mode="dark"]) .link-card {
    color: var(--color-surface-50);
    background-color: #2e3136 !important; /* Cor escura que combina com o tema Mona */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .link-card {
      width: 100%;
    }
  }
</style>