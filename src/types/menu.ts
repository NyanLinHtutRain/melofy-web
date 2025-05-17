export type Menu = {
  id: number;
  title: string;
  path?: string; // 👈 optional!
  newTab: boolean;
  submenu?: Menu[];
};
