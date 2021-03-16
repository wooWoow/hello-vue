import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: '',
    userName: ''
  },
  mutations: {
    changeUserInfo (state, payload) {
      payload.userId !== undefined && (state.userId = payload.userId);
      payload.userName !== undefined && (state.userName = payload.userName);
    }
  },
  actions: {
  },
  modules: {
  }
});
