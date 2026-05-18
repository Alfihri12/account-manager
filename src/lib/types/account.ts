export type Category = 'game' | 'sosmed' | 'dev' | 'freelance' | 'education' | 'other';

export type Status = 'active' | 'need_check' | 'inactive' | 'lost';

export type EmailItem = {
	id: number;
	label: string;
	address: string;
	provider: string;
	purpose: string;
	twoFactor: boolean;
	accountCount: number;
	recovery: string;
	status: 'safe' | 'audit';
};

export type AccountItem = {
	id: number;
	name: string;
	category: Category;
	platform: string;
	username: string;
	userId?: string;
	loginMethod: string;
	linkedEmailId: number;
	passwordLocation: string;
	twoFactor: boolean;
	status: Status;
	tags: string[];
	notes: string;
};
