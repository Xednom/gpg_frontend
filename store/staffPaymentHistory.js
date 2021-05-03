const blankState = {
    staff: "",
    date: "",
    amount: "",
    transaction_number: "",
    payment_channel: "",
    notes: ""
  };
  
  export const state = () => ({
    ...blankState,
    paymentHistories: [],
    paymentHistory: {},
    paymentHistoriesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    staff: (state) => state.staff,
    date: (state) => state.date,
    amount: (state) => state.amount,
    transaction_number: (state) => state.transaction_number,
    payment_channel: (state) => state.payment_channel,
    paymentHistories: (state) => state.paymentHistories,
    paymentHistoriesPagination: (state) => state.paymentHistoriesPagination,
    paymentHistory: (state) => {
      return state.paymentHistory;
    },
  };
  
  export const mutations = {
    setPaymentHistory(state, payload) {
      state.paymentHistory = payload.paymentHistory;
    },
    setPaymentHistories(state, payload) {
      state.paymentHistories = payload.paymentHistories;
    },
    setPaymentHistoriesPagination(state, payload) {
      state.paymentHistoriesPagination = payload;
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
    async fetchPaymentHistories({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/staff-payment-history/", { params: params })
        .then((res) => {
          commit("setPaymentHistories", { paymentHistories: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setPaymentHistoriesPagination", {
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
    async fetchPaymentHistory({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/staff-payment-history/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setPaymentHistory", { paymentHistory: res.data });
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
    async savePayment({ commit }, payload) {
      let url = "/api/v1/staff-payment-history/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updatePayment({ commit }, payload) {
      let url = `/api/v1/staff-payment-history/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    },
  };
  