export interface NavLink {
  href: string;
  label: string;
}
export interface NavIcon {
  initials?: string;
  firstName?: string;
  lastName?: string;
}
export const navLinks: NavLink[] = [
  { href: '#', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export const navIcon: NavIcon = {
  initials: 'MZS',
  firstName: 'Max',
  lastName: 'Zimmer-Smith',
};
