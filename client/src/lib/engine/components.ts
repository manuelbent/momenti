import type { Component } from 'svelte'

import Hero from '../components/Hero.svelte'

export const map: Record<string, Component> = {
    hero: Hero,
}
