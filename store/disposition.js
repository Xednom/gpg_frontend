const blankState = {
  property_detail: null,
  apn: "",
  client_code: "",
  selling_price: "",
  discounted_cash_price: "",
  selling_price_minimum: "",
  selling_price_maximum: "",
  financed_terms: "",
  amount_closed_deal: "",
  deal_status: "",
  assigned_sales_team: null,
  notes: "",
};

export const state = () => ({
  ...blankState,
  dispositions: [],
  disposition: {},
  leadAssignedTo: {},
  dispositionFile: {},
  dispositionsPagination: {
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
  dispositionsPagination: (state) => state.dispositionsPagination,
  dispositions: (state) => state.dispositions,
  disposition: (state) => {
    return state.disposition;
  },
};

export const mutations = {
  setDisposition(state, payload) {
    state.disposition = payload.disposition;
  },
  setDispositions(state, payload) {
    state.dispositions = payload.dispositions;
  },
  setDispositionsPagination(state, payload) {
    state.dispositionsPagination = payload;
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
  async fetchDisposition({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/disposition/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setDisposition", { disposition: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchDispositions({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/disposition/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setDispositions", { dispositions: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setDispositionsPagination", {
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
  async saveDisposition({ commit, dispatch }, payload) {
    let url = "/api/v1/disposition/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveDispositions({ commit, dispatch }, payload) {
    let url = "/api/v1/save-dispositions/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteDisposition({ commit, dispatch }, payload) {
    let url = `/api/v1/disposition/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateDisposition({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/disposition/${payload.id}/`;
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
