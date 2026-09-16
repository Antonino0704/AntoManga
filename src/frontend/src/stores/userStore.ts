import { defineStore } from 'pinia';
import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from '@/utils/endpoints';
import type { User, Profile } from '@/@types/interfaces';

export const useUserStore = defineStore('user', {
	state: () => ({
		profile: {
			user: {} as User
		} as Profile,
		loaded: false
	}),
	getters: {
		user(state) {
			return state.profile.user;
		}
	},
	actions: {
		async userMe() {
			this.profile.user = await apiExpress.get<User>(endpoints.userMe);
			this.profile.avatar = (await apiExpress.get<Profile>(endpoints.myAvatar)).avatar;
			this.loaded = true;
		}
	}
});
