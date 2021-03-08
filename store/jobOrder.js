const blankState = {
    request_date: "",
    due_date: "",
    job_title: "",
    job_description: "",
    client_notes: "",
    va_notes: false,
    status: false,
    date_completed: false,
    total_time_consumed: "",
    client: {},
    va_assigned: {}
  };
  
  export const state = () => ({
    ...blankState,
    jobOrders: [],
    jobOrder: {},
    jobOrdersPagination: {
      limit: 12,
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1
    }
  });
  
  export const getters = {
    request_date: state => state.request_date,
    due_date: state => state.due_date,
    job_title: state => state.job_title,
    job_description: state => state.job_description,
    client_notes: state => state.client_notes,
    va_notes: state => state.va_notes,
    status: state => state.status,
    date_completed: state => state.date_completed,
    total_time_consumed: state => state.total_time_consumed,
    client: state => state.client,
    va_assigned: state => state.va_assigned,
    jobOrdersPagination: state => state.jobOrdersPagination,
    jobOrders: state => state.jobOrders,
    jobOrder: state => {
        return state.jobOrder
    }
  };
  
  export const mutations = {
    setJobOrder(state, payload) {
      state.jobOrder = payload.jobOrder;
    },
    setJobOrders(state, payload) {
      state.jobOrders = payload.jobOrders;
    },
    setJobOrdersPagination(state, payload) {
      state.jobOrdersPagination = payload;
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
    async fetchJobOrders({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/job-order/", { params: params })
        .then(res => {
          commit("setJobOrders", { jobOrders: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setJobOrdersPagination", {
            limit: 12,
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
    async fetchClientUser({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/client/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setClientUser", { clientUser: res.data });
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
    async saveMe({ commit }, payload) {
      let url = "/auth/users/me/";
      return await this.$axios.put(url, payload).then(res => {
        commit("setUser", payload);
      })
      .catch((err) => {
        console.log(err);
      });
    },
    async updateClientUser({commit, dispatch}, payload) {
      let url = `/api/v1/client/${payload}/`;
      if (payload.id) {
        return await this.$axios.put(url, payload.id).then(res => {
          commit("setBasicField", payload);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    updateField({commit}, {first_name, fieldName, value}) {
      commit("updateField", {first_name, fieldName, value});
    },
    reset({commit}) {
      commit("reset");
    }
  };
  