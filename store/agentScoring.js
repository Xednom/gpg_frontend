const blankState = {
  staff: null,
  client: null,
  job_order_general: null,
  accuracy: 0,
  speed: 0,
  quality_of_work: 0,
  delivered_on_time: true,
  delivery_note: "",
  job_completed: true,
  job_completed_note: "",
  satisfied: true,
};

export const state = () => ({
  ...blankState,
  scorings: [],
  scoring: {},
  scoringsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  staff: (state) => state.staff,
  client: (state) => state.client,
  job_order_general: (state) => state.job_order_general,
  accuracy: (state) => state.accuracy,
  speed: (state) => state.speed,
  quality_of_work: (state) => state.quality_of_work,
  delivered_on_time: (state) => state.delivered_on_time,
  delivery_note: (state) => state.delivery_note,
  job_completed: (state) => state.job_completed,
  job_completed_note: (state) => state.job_completed_note,
  satisfied: (state) => state.satisfied,
  scorings: (state) => state.scorings,
  scoringsPagination: (state) => state.scoringsPagination,
  scoring: (state) => {
    return state.scoring;
  },
};

export const mutations = {
  setScoring(state, payload) {
    state.scoring = payload.scoring;
  },
  setScorings(state, payload) {
    state.scorings = payload.scorings;
  },
  setScoringsPagination(state, payload) {
    state.scoringsPagination = payload;
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
  async fetchScorings({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/job-order-general-agent-scoring/", { params: params })
      .then((res) => {
        commit("setScorings", { scorings: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setScoringssPagination", {
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
  async fetchAccountFile({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/account-files/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setAccountFile", { accountFile: res.data });
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
  async saveGeneralScore({ commit }, payload) {
    let url = "/api/v1/job-order-general-agent-scoring/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  async saveCategoryScore({ commit }, payload) {
    let url = "/api/v1/job-order-category-agent-scoring/";
    try {
      return await this.$axios.post(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.error(err);
    }
  },
  reset({ commit }) {
    commit("reset");
  },
};
