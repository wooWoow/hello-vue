import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: '',
    userName: '',
    userStatus: '',
    userRoles: '',
  },
  mutations: {
    changeUserInfo (state, payload) {
      payload.userId !== undefined && (state.userId = payload.userId);
      payload.userName !== undefined && (state.userName = payload.userName);
      payload.userStatus !== undefined && (state.userStatus = payload.userStatus);
      payload.userRoles !== undefined && (state.userRoles = payload.userRoles);
    },
    clearUserInfo (state) {
      state.userId = '';
      state.userName = '';
      state.userStatus = '';
      state.userRoles = '';
    }
  },
  actions: {
  },
  modules: {
  }
});
