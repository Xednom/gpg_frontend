const blankState = {
  property_detail: null,
  apn: "",
  client_code: "",
  date_lead_added: "",
  lead_type: "",
  seller_lead_name: "",
  phone_number: "",
  email: "",
  lead_status: "",
  seller_asking_price: "",
  counter_offer_amount: [],
  lead_assigned_to: null,
  total_minutes_consumed: "",
  notes: "",
};

export const state = () => ({
  ...blankState,
  sellerLists: [],
  sellerList: {},
  leadAssignedTo: {},
  sellerListFile: {},
  sellerListsPagination: {
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
  seller_lead_name: (state) => state.seller_lead_name,
  phone_number: (state) => state.phone_number,
  email: (state) => state.email,
  lead_status: (state) => state.lead_status,
  seller_asking_price: (state) => state.seller_asking_price,
  counter_offer_amount: (state) => state.counter_offer_amount,
  lead_assigned_to: (state) => state.lead_assigned_to,
  total_minutes_consumed: (state) => state.total_minutes_consumed,
  notes: (state) => state.notes,
  sellerListsPagination: (state) => state.sellerListsPagination,
  sellerLists: (state) => state.sellerLists,
  sellerList: (state) => {
    return state.sellerList;
  },
};

export const mutations = {
  setSellerList(state, payload) {
    state.sellerList = payload.sellerList;
  },
  setSellerLists(state, payload) {
    state.sellerLists = payload.sellerLists;
  },
  setSellerListsPagination(state, payload) {
    state.sellerListsPagination = payload;
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
  // async fetchSellerLists({ commit, dispatch }, params) {
  //   return await this.$axios
  //     .get("/api/v1/seller-list/", { params: params })
  //     .then((res) => {
  //       commit("setSellerLists", { sellerLists: res.data.results });
  //       const offset = getOffset(res.data.previous);
  //       commit("setSellerListsPagination", {
  //         offset: offset,
  //         count: res.data.count,
  //         showing: res.data.results.length,
  //         currentPage: offset / 12 + 1,
  //       });
  //       return res;
  //     })
  //     .catch((e) => {
  //       throw e;
  //     });
  // },
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
  async fetchSellerList({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/seller-list/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setSellerList", { sellerList: res.data });
        console.warn("Seller info: ", { sellerList: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchSellerLists({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/seller-list/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setSellerLists", { sellerLists: res.data.results });
        console.warn("Seller info: ", { sellerLists: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setSellerListsPagination", {
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
  async saveSellerList({ commit, dispatch }, payload) {
    let url = "/api/v1/seller-list/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveSellerLists({ commit, dispatch }, payload) {
    let url = "/api/v1/save-seller-lists/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteSellerList({ commit, dispatch }, payload) {
    let url = `/api/v1/seller-list/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateSellerList({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/seller-list/${payload.id}/`;
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
