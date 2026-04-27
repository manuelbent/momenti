import { writable } from 'svelte/store';

export const moment = writable({
  title: 'Sophie & Marco – Wedding',
  theme: {
    primary: '#f9a8d4',
    background: '#fff7f0',
    text: '#1a1a1a',
  },
  blocks: [
    {
      type: 'hero',
      props: {
        title: 'Sophie & Marco',
        description: 'Join us to celebrate our wedding on July 12, 2026 in Florence, Italy.',
      },
    },
  ],
});

