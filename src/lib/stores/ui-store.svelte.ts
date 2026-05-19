type SelectedMenu = 'dashboard' | 'emails' | 'games' | 'sosmed' | 'settings';

let selectedMenu = $state<SelectedMenu>('dashboard');
let search = $state('');
let selectedCategory = $state('all');
let selectedEmail = $state('all');
let selectedAccountId = $state(1);

export function useUiStore() {
	return {
		get selectedMenu() {
			return selectedMenu;
		},
		set selectedMenu(value: SelectedMenu) {
			selectedMenu = value;
		},
		get search() {
			return search;
		},
		set search(value: string) {
			search = value;
		},
		get selectedCategory() {
			return selectedCategory;
		},
		set selectedCategory(value: string) {
			selectedCategory = value;
		},
		get selectedEmail() {
			return selectedEmail;
		},
		set selectedEmail(value: string) {
			selectedEmail = value;
		},
		get selectedAccountId() {
			return selectedAccountId;
		},
		set selectedAccountId(value: number) {
			selectedAccountId = value;
		}
	};
}
