const blankState = {
    ticket_number: "",
    property_detail: null,
    client: null,
    staff: null,
    category: "",
    status: "",
    due_date: "",
    date_completed: "",
    job_description: "",
    url_of_the_completed_jo: "",
    notes_va: "",
    notes_management: "",
    total_time_consumed: "",
    comment: "",
    deadline: "",
  };
  
  export const state = () => ({
    ...blankState,
    jobOrderCategories: [],
    apnCategories: [],
    deadlines: [],
    jobOrderCategory: {},
    jobOrderCategoriesPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    ticket_number: (state) => state.ticket_number,
    client: (state) => state.client,
    property_detail: (state) => state.property_detail,
    staff: (state) => state.staff,
    category: (state) => state.category,
    status: (state) => state.status,
    due_date: (state) => state.due_date,
    date_completed: (state) => state.date_completed,
    job_description: (state) => state.job_description,
    url_of_the_completed_jo: (state) => state.url_of_the_completed_jo,
    notes_va: (state) => state.notes_va,
    notes_management: (state) => state.notes_management,
    total_time_consumed: (state) => state.total_time_consumed,
    comment: (state) => state.comment,
    jobOrderCategoriesPagination: (state) => state.jobOrderCategoriesPagination,
    jobOrderCategories: (state) => state.jobOrderCategories,
    apnCategories: (state) => state.apnCategories,
    deadline: (state) => state.deadline,
    deadlines: (state) => state.deadlines,
    jobOrderCategory: (state) => {
      return state.jobOrderCategory;
    },
  };
  
  export const mutations = {
    setJobOrderCategory(state, payload) {
      state.jobOrderCategory = payload.jobOrderCategory;
    },
    setJobOrderCategories(state, payload) {
      state.jobOrderCategories = payload.jobOrderCategories;
    },
    setJobOrderCategoriesPagination(state, payload) {
      state.jobOrderCategoriesPagination = payload;
    },
    setCategories(state, payload) {
      state.apnCategories = payload.apnCategories;
    },
    setDeadlines(state, payload) {
      state.deadlines = payload.deadlines
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
    async fetchJobOrderCategories({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/job-order-by-category/", { params: params })
        .then((res) => {
          commit("setJobOrderCategories", { jobOrderCategories: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setJobOrderCategoriesPagination", {
            offset: offset,
            count: res.data.count,
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
    async fetchCategory({ commit, dispatch }) {
      let endpoint = `/api/v1/apn-category-type/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setCategories", { apnCategories: res.data.results });
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchDeadline({ commit, dispatch }) {
      let endpoint = `/api/v1/deadline/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setDeadlines", { deadlines: res.data.results });
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchJobOrderCategory({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/job-order-by-category/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setJobOrderCategory", { jobOrderCategory: res.data });
        })
        .catch((e) => {
          throw e;
        });
    },
    async saveJobOrderCategory({ commit, dispatch }, payload) {
      let url = "/api/v1/job-order-by-category/";
      await this.$axios.post(url, payload).then((res) => {
        return res.data;
      });
    },
    async deleteJobOrderCategory({ commit, dispatch }, payload) {
      let url = `/api/v1/job-order-by-category/${payload}/`;
      try {
        await this.$axios.delete(url, payload);
      } catch (err) {
        console.error(err);
      }
    },
    async updateJobOrderCategory({ commit }, payload) {
      console.log(payload.ticket_number);
      let url = `/api/v1/job-order-by-category/${payload.ticket_number}/`;
      let method = "put";
      console.log(payload);
      return await this.$axios[method](url, payload).then((res) => {
        return res.data;
      });
    },
    reset({ commit }) {
      commit("reset");
    },
  };
  