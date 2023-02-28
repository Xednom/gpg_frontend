const blankState = {
  property_detail: null,
  apn: "",
  client_code: "",
  date_lead_added: "",
  lead_type: "",
  buyer_lead_name: "",
  phone_number: "",
  email: "",
  lead_status: "",
  buyer_offer: "",
  counter_offer_amount: [],
  lead_assigned_to: null,
  total_minutes_consumed: "",
  notes: "",
};

export const state = () => ({
  ...blankState,
  buyerLists: [],
  buyerList: {},
  leadAssignedTo: {},
  buyerListFile: {},
  buyerListsPagination: {
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
  date_lead_added: (state) => state.date_lead_added,
  lead_type: (state) => state.lead_type,
  buyer_lead_name: (state) => state.buyer_lead_name,
  phone_number: (state) => state.phone_number,
  email: (state) => state.email,
  lead_status: (state) => state.lead_status,
  buyer_asking_price: (state) => state.buyer_asking_price,
  counter_offer_amount: (state) => state.counter_offer_amount,
  lead_assigned_to: (state) => state.lead_assigned_to,
  total_minutes_consumed: (state) => state.total_minutes_consumed,
  notes: (state) => state.notes,
  buyerListsPagination: (state) => state.buyerListsPagination,
  buyerLists: (state) => state.buyerLists,
  buyerList: (state) => {
    return state.buyerList;
  },
};

export const mutations = {
  setBuyerList(state, payload) {
    state.buyerList = payload.buyerList;
  },
  setBuyerLists(state, payload) {
    state.buyerLists = payload.buyerLists;
  },
  setBuyerListsPagination(state, payload) {
    state.buyerListsPagination = payload;
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
  async fetchBuyerList({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/buyer-list/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setbuyerList", { buyerList: res.data });
        console.warn("buyer info: ", { buyerList: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchBuyerLists({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/buyer-list/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setBuyerLists", { buyerLists: res.data.results });
        console.warn("buyer info: ", { buyerLists: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setBuyerListsPagination", {
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
  async saveBuyerList({ commit, dispatch }, payload) {
    let url = "/api/v1/buyer-list/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveBuyerLists({ commit, dispatch }, payload) {
    let url = "/api/v1/save-buyer-lists/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteBuyerList({ commit, dispatch }, payload) {
    let url = `/api/v1/buyer-list/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateBuyerList({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/buyer-list/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};
