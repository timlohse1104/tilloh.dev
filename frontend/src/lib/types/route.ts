import type { Component } from 'svelte';

type RouteName = {
  en: string;
  de: string;
};

export type Route = {
  id: string;
  name: RouteName;
  path: string;
  icon: Component | undefined;
  toggle: boolean;
};
