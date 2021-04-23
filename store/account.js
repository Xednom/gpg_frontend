const blankState = {
    client: "",
    category: "",
    url: "",
    username: "",
    password: "",
    notes: "",
    staff: ""
  };
  
  export const state = () => ({
    ...blankState,
    accounts: [],
    account: {},
    accountsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    client: state => state.client,
    category: state => state.category,
    url: state => state.url,
    username: state => state.username,
    password: state => state.password,
    notes: state => state.notes,
    staff: state => state.staff,
    accounts: state => state.accounts,
    accountsPagination: state => state.accountsPagination,
    account: state => {
        return state.account
    }
  };
  
  export const mutations = {
    setAccount(state, payload) {
      state.account = payload.account;
    },
    setAccounts(state, payload) {
      state.accounts = payload.accounts;
    },
    setAccountsPagination(state, payload) {
      state.accountsPagination = payload;
    },
    setBasicField(state, {field, value}) {
      state[field] = value;
    },
    reset(state) {
      Object.assign(state, blankState);
    }
  };
  
  function getOffset(urlStr) {
    if (!urlStr) {
      return 0;
    }
    const url = new URL(urlStr);
    return parseInt(url.searchParams.get("offset"));
  }
  
  export const actions = {
    async fetchAccounts({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/login-credentials/", { params: params })
        .then(res => {
          commit("setAccounts", { accounts: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setAccountsPagination", {
            offset: offset,
            count: res.data.count,
            showing: res.data.results.length,
            currentPage: offset / 12 + 1
          });
          return res;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchUser({ commit, dispatch }) {
      let endpoint = `/auth/users/me/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setUser", { user: res.data });
          return res;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchAccount({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/login-credentials/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setAccount", { account: res.data });
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchAdminUser({ commit, dispatch }, payload) {
      let endpoint = `/auth/admin-users-list/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setUser", {user: res.data} );
        })
        .catch(e => {
          throw e;
        });
    },
    async saveAccount({ commit }, payload) {
      let url = "/api/v1/login-credentials/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    async updateAccount({ commit }, payload) {
      let url = `/api/v1/login-credentials/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({commit}) {
      commit("reset");
    }
  };
  