import { defineStore } from 'pinia';
import { apiService } from '@/utils/APIService';
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
			await apiService(endpoints.userMe).then((response: User) => {
				this.profile.user = response;
			});
			await apiService(endpoints.myAvatar).then((avatarProfile: Profile) => {
				this.profile.avatar = avatarProfile.avatar;
			});
			this.loaded = true;
		}
	}
});
