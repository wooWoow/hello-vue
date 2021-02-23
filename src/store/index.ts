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
      state.userId = payload.userId;
      state.userName = payload.userName;
    }
  },
  actions: {
  },
  modules: {
  }
});
