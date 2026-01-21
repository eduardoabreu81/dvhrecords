import { useEffect } from 'react';

/**
 * Hook para adicionar proteções de segurança contra cópia e download de conteúdo
 * - Desabilita clique direito (context menu)
 * - Desabilita drag de imagens
 * - Desabilita seleção de texto em elementos sensíveis
 * - Desabilita atalhos de teclado para salvar página
 */
export function useSecurityProtection() {
  useEffect(() => {
    // Desabilitar context menu (clique direito)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Desabilitar drag de imagens
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Desabilitar atalhos de teclado para salvar
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S ou Cmd+S (salvar página)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U ou Cmd+U (ver código fonte)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // F12 (DevTools) - Nota: não é 100% bloqueável
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I ou Cmd+Shift+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C ou Cmd+Shift+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
    };

    // Adicionar event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // Adicionar atributos de proteção em imagens e áudios
    const protectMedia = () => {
      // Proteger imagens
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'auto'; // Manter eventos para funcionalidade
      });

      // Proteger áudios
      const audios = document.querySelectorAll('audio');
      audios.forEach((audio) => {
        audio.setAttribute('controlsList', 'nodownload');
        audio.setAttribute('oncontextmenu', 'return false');
      });
    };

    // Executar proteção inicial
    protectMedia();

    // Observer para proteger elementos adicionados dinamicamente
    const observer = new MutationObserver(protectMedia);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, []);
}
