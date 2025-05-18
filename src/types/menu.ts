export type Menu = {
  id: number;
  title: string;
  path?: string; // 👈 optional! ok
  newTab: boolean;
  submenu?: Menu[];
};
