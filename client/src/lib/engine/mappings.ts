import Hero from '../components/Hero.svelte';
import type { Component } from 'svelte';

export const componentMap: Record<string, Component> = {
    hero: Hero,
};

