const blankState = {
  date_submitted: "",
  category: null,
  description: "",
  assigned_to: null,
  client: null,
  resolution_provided_by_management: "",
  status: "",
  additional_notes: "",
};

export const state = () => ({
  ...blankState,
  resolutions: [],
  categories: [],
  resolution: {},
  resolutionsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  date_submitted: (state) => state.date_submitted,
  category: (state) => state.category,
  description: (state) => state.description,
  assigned_to: (state) => state.assigned_to,
  client: (state) => state.client,
  resolution_provided_by_management: (state) =>
    state.resolution_provided_by_management,
  status: (state) => state.status,
  additional_notes: (state) => state.additional_notes,
  resolutions: (state) => state.resolutions,
  categories: (state) => state.categories,
  resolutionsPagination: (state) => state.resolutionsPagination,
  resolution: (state) => {
    return state.resolution;
  },
};

export const mutations = {
  setResolution(state, payload) {
    state.resolution = payload.resolution;
  },
  setResolutions(state, payload) {
    state.resolutions = payload.resolutions;
  },
  setCategories(state, payload) {
    state.categories = payload.categories;
  },
  setResolutionsPagination(state, payload) {
    state.resolutionsPagination = payload;
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
  async fetchResolutions({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/resolution/", { params: params })
      .then((res) => {
        commit("setResolutions", { resolutions: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setResolutionsPagination", {
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
  async fetchResolution({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/resolution/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setResolution", { resolution: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchCategory({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/category/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setCategories", { categories: res.data.results });
      })
      .catch((e) => {
        throw e;
      });
  },
  async saveResolution({ commit }, payload) {
    let url = `/api/v1/resolution/`;
    let method = "post";
    if (payload.id) {
      method = "put";
      url += `${payload.id}/`;
      return await this.$axios[method](url, payload);
    }
    return await this.$axios[method](url, payload).then((res) => {
      this.$router.push({ name: "resolution-id___en", params: { id: res.data.id } });
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};
