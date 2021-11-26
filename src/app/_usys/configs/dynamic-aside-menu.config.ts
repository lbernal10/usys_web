export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    { section: 'Estructura Organizacional' },
    {
      title: 'Organizaciones',
      root: true,
      icon: 'flaticon2-expand',
      page: '/organizacion',
      svg: './assets/media/svg/icons/Home/Building.svg'
    },
    {
      title: 'Empleados',
      root: true,
      icon: 'flaticon2-expand',
      page: '/empleado',
      svg: './assets/media/svg/icons/Communication/Group.svg'
    },
    {
      title: 'Áreas',
      root: true,
      icon: 'flaticon2-expand',
      page: '/area',
      svg: './assets/media/svg/icons/Home/Flower2.svg'
    },
    { section: 'Gestión de usuarios' },
    {
      title: 'Usuarios',
      root: true,
      icon: 'flaticon2-expand',
      page: '/usuario',
      svg: './assets/media/svg/icons/Communication/Shield-user.svg'
    },
    {
      title: 'Roles',
      root: true,
      icon: 'flaticon2-expand',
      page: '/rol',
      svg: './assets/media/svg/icons/Code/Option.svg'
    },
    {
      title: 'Permisos',
      root: true,
      icon: 'flaticon2-expand',
      page: '/permiso',
      svg: './assets/media/svg/icons/General/Settings-1.svg'
    },
    { section: 'Gestión documental' },
    {
      title: 'Documentos',
      root: true,
      icon: 'flaticon2-expand',
      page: '/documento',
      svg: './assets/media/svg/icons/Shopping/Box1.svg'
    },
    {
      title: 'Metadatos',
      root: true,
      icon: 'flaticon2-expand',
      page: '/metadato',
      svg: './assets/media/svg/icons/Code/Puzzle.svg'
    },
  ]
};
