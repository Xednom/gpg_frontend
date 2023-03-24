const blankState = {
  property_detail: null,
  apn: "",
  client_code: "",
  description: "",
  notes: "",
  description_of_request: "",
  completed_job_order_file: "",
  date_completed: null,
  status_of_job: "",
  images: "",
  ad_content: "",
  youtube_videos: "",
  tiktok_videos: "",
  email_campaign: "",
  other_graphics: "",
  other_makerting_files: "",
  neighbor_list: "",
  assigned_to: null,
};

export const state = () => ({
  ...blankState,
  marketings: [],
  marketing: {},
  leadAssignedTo: {},
  marketingFile: {},
  marketingsPagination: {
    offset: 0,
    count: 0,
    showing: 0,
    currentPage: 1,
  },
});

export const getters = {
  property_detail: (state) => state.property_detail,
  apn: (state) => state.apn,
  client_code: (state) => state.client_code,
  description: (state) => state.description,
  description_of_request: (state) => state.description_of_request,
  completed_job_order_file: (state) => state.completed_job_order_file,
  date_completed: (state) => state.date_completed,
  status_of_job: (state) => state.status_of_job,
  images: (state) => state.images,
  ad_content: (state) => state.ad_content,
  youtube_videos: (state) => state.youtube_videos,
  tiktok_videos: (state) => state.tiktok_videos,
  email_campaign: (state) => state.email_campaign,
  other_graphics: (state) => state.other_graphics,
  other_makerting_files: (state) => state.other_makerting_files,
  neighbor_list: (state) => state.neighbor_list,
  notes: (state) => state.notes,
  assigned_to: (state) => state.assigned_to,
  marketingsPagination: (state) => state.marketingsPagination,
  marketings: (state) => state.marketings,
  marketing: (state) => {
    return state.marketing;
  },
};

export const mutations = {
  setMarketing(state, payload) {
    state.marketing = payload.marketing;
  },
  setMarketings(state, payload) {
    state.marketings = payload.marketings;
  },
  setMarketingsPagination(state, payload) {
    state.marketingsPagination = payload;
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
  async fetchMarketing({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/marketing/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setMarketing", { marketing: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchMarketings({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/marketing/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setMarketings", { marketings: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setMarketingsPagination", {
          offset: offset,
          count: res.data.count,
          showing: res.data.results.length,
          currentPage: offset / 12 + 1,
        });
      })
      .catch((e) => {
        throw e;
      });
  },
  async saveMarketing({ commit, dispatch }, payload) {
    let url = "/api/v1/marketing/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async savemarketings({ commit, dispatch }, payload) {
    let url = "/api/v1/save-marketings/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteMarketing({ commit, dispatch }, payload) {
    let url = `/api/v1/marketing/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateMarketing({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/marketing/${payload.id}/`;
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
