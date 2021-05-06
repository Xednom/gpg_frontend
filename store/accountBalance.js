const blankState = {
    client: "",
    total_payment_made: "",
    total_time_consumed: "",
    amount_due: "",
    account_balance: "",
    notes: ""
  };
  
  export const state = () => ({
    ...blankState,
    paymentPortals: [],
    accountBalances: [],
    accountBalance: {},
    accountBalancesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    client: (state) => state.client,
    total_payment_made: (state) => state.total_payment_made,
    total_time_consumed: (state) => state.total_time_consumed,
    amount_due: (state) => state.amount_due,
    account_balance: (state) => state.account_balance,
    notes: (state) => state.notes,
    paymentPortals: (state) => state.paymentPortals,
    accountBalances: (state) => state.accountBalances,
    accountBalancesPagination: (state) => state.accountBalancesPagination,
    accountBalance: (state) => {
      return state.accountBalance;
    },
  };
  
  export const mutations = {
    setPaymentPortals(state, payload) {
      state.paymentPortals = payload.paymentPortals;
    },
    setAccountBalance(state, payload) {
      state.accountBalance = payload.accountBalance;
    },
    setAccountBalances(state, payload) {
      state.accountBalances = payload.accountBalances;
    },
    setAccountBalancesPagination(state, payload) {
      state.accountBalancesPagination = payload;
    },
    setBasicField(state, { field, value }) {
      state[field] = value;
    },
    reset(state) {
      Object.assign(state, blankState);
    },
  };
  
  function getOffset(urlStr) {
    if (!urlStr) {
      return 0;
    }
    const url = new URL(urlStr);
    return parseInt(url.searchParams.get("offset"));
  }
  
  export const actions = {
    async fetchAccountBalances({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/account-balance/", { params: params })
        .then((res) => {
          commit("setAccountBalances", { accountBalances: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setAccountBalancesPagination", {
            offset: offset,
            count: res.data.count,
          //   next: res.data.next,
          //   previous: res.data.previous,
            showing: res.data.results.length,
            currentPage: offset / 12 + 1,
          });
          return res;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchPaymentPortals({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/payment-portal/", { params: params })
        .then((res) => {
          commit("setPaymentPortals", { paymentPortals: res.data.results });
          return res;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchUser({ commit, dispatch }) {
      let endpoint = `/auth/users/me/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setUser", { user: res.data });
          return res;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchAccountBalance({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/account-balance/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setAccountBalance", { accountBalance: res.data });
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchAdminUser({ commit, dispatch }, payload) {
      let endpoint = `/auth/admin-users-list/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setUser", { user: res.data });
        })
        .catch((e) => {
          throw e;
        });
    },
    async saveBalance({ commit }, payload) {
      let url = "/api/v1/account-balance/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updatePayment({ commit }, payload) {
      let url = `/api/v1/account-balance/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    },
  };
  