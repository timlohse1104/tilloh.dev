type RouteName = {
  en: string;
  de: string;
};

export type Route = {
  id: string;
  name: RouteName;
  path: string;
  icon: string;
  toggle: boolean;
};
