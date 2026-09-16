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
			try {
				this.profile.user = await apiExpress.get<User>(endpoints.userMe);
			} catch (err) {
				console.log(err);
				this.profile.user = {} as User;
			}
			try {
				this.profile.avatar = (await apiExpress.get<Profile>(endpoints.myAvatar)).avatar;
			} catch (err) {
				console.log(err);
				this.profile.avatar = '';
			}

			this.loaded = true;
		}
	}
});
