export type Social = {
	id: 'github' | 'linkedin' | 'mail';
	label: string;
	handle: string;
	url: string;
};

export const socials: Social[] = [
	{ id: 'mail', label: 'Correo', handle: 'gonzalezambranopaula840@gmail.com', url: 'mailto:gonzalezambranopaula840@gmail.com' },
	{ id: 'github', label: 'GitHub', handle: 'github.com/SoFzzz', url: 'https://github.com/SoFzzz' },
	{
		id: 'linkedin',
		label: 'LinkedIn',
		handle: 'Paula Sofía González Zambrano',
		url: 'https://www.linkedin.com/in/paula-sofia-gonzalez-zambrano-435081265/'
	}
];
