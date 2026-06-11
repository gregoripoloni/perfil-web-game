import { useToast } from 'primevue';

export function useCopyRoomUrl() {
  const toast = useToast();

  const roomUrl = window.location.href.replace(/^https?:\/\//, '');

  const copyRoomUrl = async () => {
    await navigator.clipboard.writeText(roomUrl);
    toast.add({
      severity: 'secondary',
      summary: 'Copiado!',
      life: 3000,
    });
  };

  return { roomUrl, copyRoomUrl };
}
