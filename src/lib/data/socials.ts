export type Social = {
	id: 'github' | 'linkedin' | 'mail';
	label: string;
	handle: string;
	url: string;
};

export const socials: Social[] = [
	{ id: 'github', label: 'GitHub', handle: 'github.com/SoFzzz', url: 'https://github.com/SoFzzz' },
	{
		id: 'linkedin',
		label: 'LinkedIn',
		handle: 'Paula Sofía González Zambrano',
		url: 'https://www.linkedin.com/in/paula-sofia-gonzalez-zambrano-435081265/'
	}
	// Correo pendiente de confirmar:
	// { id: 'mail', label: 'Correo', handle: 'correo@ejemplo.com', url: 'mailto:correo@ejemplo.com' }
];
