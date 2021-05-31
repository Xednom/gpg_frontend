const blankState = {
    ticket_number: "",
    client: null,
    staff: null,
    shift_date: "",
    job_request: "",
    job_request_description: "",
    total_items: "",
    notes: "",
    total_time: "",
    status: "",
    staff_hourly_rate: "",
    staff_fee: "",
    staff_other_fee: "",
    staff_total_due: "",
    client_hourly_rate: "",
    client_other_fee: "",
    client_total_charge: "",
    client_total_due: ""
  };
  
  export const state = () => ({
    ...blankState,
    accountCharges: [],
    accountCharge: {},
    accountChargesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    ticket_number: (state) => state.ticket_number,
    client: (state) => state.client,
    staff: (state) => state.staff,
    shift_date: (state) => state.shift_date,
    job_request: (state) => state.job_request,
    job_request_description: (state) => state.job_request_description,
    total_items: (state) => state.total_items,
    notes: (state) => state.notes,
    total_time: (state) => state.total_time,
    status: (state) => state.status,
    staff_hourly_rate: (state) => state.staff_hourly_rate,
    staff_fee: (state) => state.staff_fee,
    staff_other_fee: (state) => state.staff_other_fee,
    staff_total_due: (state) => state.staff_total_due,
    client_hourly_rate: (state) => state.client_hourly_rate,
    client_other_fee: (state) => state.client_other_fee,
    client_total_charge: (state) => state.client_total_charge,
    client_total_due: (state) => state.client_total_due,
    accountCharges: (state) => state.accountCharges,
    accountChargesPagination: (state) => state.accountChargesPagination,
    accountCharge: (state) => {
      return state.accountCharge;
    },
  };
  
  export const mutations = {
    setAccountCharge(state, payload) {
      state.accountCharge = payload.accountCharge;
    },
    setAccountCharges(state, payload) {
      state.accountCharges = payload.accountCharges;
    },
    setAccountChargesPagination(state, payload) {
      state.accountChargesPagination = payload;
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
    async fetchAccountCharges({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/account-charge/", { params: params })
        .then((res) => {
          commit("setAccountCharges", { accountCharges: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setAccountChargesPagination", {
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
    async fetchAccountCharge({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/account-charge/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setAccountCharge", { accountCharge: res.data });
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
    async saveCharge({ commit }, payload) {
      let url = "/api/v1/account-charge/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          commit("setBasicField", payload);
        });
      } catch (err) {
        console.error(err);
      }
    },
    async updateCharge({ commit }, payload) {
      let url = `/api/v1/account-charge/${payload.id}/`;
      let method = "put";
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    },
  };
  