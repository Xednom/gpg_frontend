const blankState = {
  property_detail: null,
  apn: "",
  client_code: "",
  possible_offer: "",
  approved_amount_from_client: "",
  minimum_amount: "",
  maximum_amount: "",
  amount_closed_deal: "",
  deal_status: "",
  assigned_sales_team: null,
  notes: "",
};

export const state = () => ({
  ...blankState,
  acquisitions: [],
  acquisition: {},
  leadAssignedTo: {},
  acquisitionFile: {},
  acquisitionsPagination: {
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
  possible_offer: (state) => state.possible_offer,
  approved_amount_from_client: (state) => state.approved_amount_from_client,
  minimum_amount: (state) => state.minimum_amount,
  maximum_amount: (state) => state.maximum_amount,
  amount_closed_deal: (state) => state.amount_closed_deal,
  deal_status: (state) => state.deal_status,
  assigned_sales_team: (state) => state.assigned_sales_team,
  notes: (state) => state.notes,
  acquisitionsPagination: (state) => state.acquisitionsPagination,
  acquisitions: (state) => state.acquisitions,
  acquisition: (state) => {
    return state.acquisition;
  },
};

export const mutations = {
  setAcquisition(state, payload) {
    state.acquisition = payload.acquisition;
  },
  setAcquisitions(state, payload) {
    state.acquisitions = payload.acquisitions;
  },
  setAcquisitionsPagination(state, payload) {
    state.acquisitionsPagination = payload;
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
  async fetchAcquisition({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/acquisition/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setAcquisition", { acquisition: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchAcquisitions({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/acquisition/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setAcquisitions", { acquisitions: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setAcquisitionsPagination", {
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
  async saveAcquisition({ commit, dispatch }, payload) {
    let url = "/api/v1/acquisition/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveAcquisitions({ commit, dispatch }, payload) {
    let url = "/api/v1/save-acquisitions/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteacquisition({ commit, dispatch }, payload) {
    let url = `/api/v1/acquisition/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateacquisition({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/acquisition/${payload.id}/`;
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
