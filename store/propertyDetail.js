const blankState = {
  ticket_number: "",
  client: null,
  staff: null,
  price_status: "",
  property_status: "",
  company_name: "",
  phone: "",
  email: "",
  website_url: "",
  file_storage: "",
  apn: "",
  county: "",
  state: "",
  size: "",
  property_owner: "",
  notes_client_side: "",
  notes_va_side: "",
  notes_management_side: "",
  comment: "",
  property_price_statuses: [],
  property_detail_files: [],
  property_detail: "",
  user: null,
  asking_price: "",
  cash_terms: "",
  finance_terms: "",
  other_terms: "",
  price_status: "",
  notes: "",
  // property detail files
  details: "",
  url: "",
  description: ""
};

export const state = () => ({
  ...blankState,
  propertyDetails: [],
  propertyDetail: {},
  propertyPrice: {},
  propertyDetailFile: {},
  propertyDetailsPagination: {
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
  price_status: (state) => state.price_status,
  property_status: (state) => state.property_status,
  company_name: (state) => state.company_name,
  phone: (state) => state.phone,
  email: (state) => state.email,
  website_url: (state) => state.website_url,
  file_storage: (state) => state.file_storage,
  apn: (state) => state.apn,
  county: (state) => state.county,
  state: (state) => state.state,
  size: (state) => state.size,
  property_owner: (state) => state.property_owner,
  property_detail: (state) => state.property_detail,
  user: (state) => state.user,
  asking_price: (state) => state.asking_price,
  cash_terms: (state) => state.cash_terms,
  finance_terms: (state) => state.finance_terms,
  other_terms: (state) => state.other_terms,
  notes: (state) => state.notes,
  notes_client_side: (state) => state.notes_client_side,
  notes_va_side: (state) => state.notes_va_side,
  notes_management_side: (state) => state.notes_manangement_side,
  propertyDetailsPagination: (state) => state.propertyDetailsPagination,
  propertyDetails: (state) => state.propertyDetails,
  comment: (state) => state.comment,
  property_price_statuses: (state) => state.property_price_statuses,
  property_detail_files: (state) => state.property_detail_files,
  details: (state) => state.details,
  url: (state) => state.url,
  description: (state) => state.description,
  propertyPrice: (state) => {
    return state.propertyPrice;
  },
  propertyDetail: (state) => {
    return state.propertyDetail;
  },
};

export const mutations = {
  setPropertyDetail(state, payload) {
    state.propertyDetail = payload.propertyDetail;
  },
  setPropertyPrice(state, payload) {
    state.propertyPrice = payload.propertyPrice;
  },
  setPropertyDetails(state, payload) {
    state.propertyDetails = payload.propertyDetails;
  },
  setPropertyDetailsPagination(state, payload) {
    state.propertyDetailsPagination = payload;
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
  async fetchPropertyDetails({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/property-detail/", { params: params })
      .then((res) => {
        commit("setPropertyDetails", { propertyDetails: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setPropertyDetailsPagination", {
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
  async fetchPropertyDetail({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/property-detail/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setBasicField", { propertyDetail: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchPropertyPriceDetail({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/property-price/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setPropertyPrice", { propertyPrice: res.data });
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
  async savePropertyDetail({ commit, dispatch }, payload) {
    let url = "/api/v1/property-detail/";
    await this.$axios.post(url, payload).then((res) => {
      return res.data;
    });
  },
  async deletePropertyDetail({ commit, dispatch }, payload) {
    let url = `/api/v1/property-detail/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async propertyDetailComment({ commit }, payload, id) {
    let url = `/api/v1/job-order-comment/${id}/`;
    try {
      return await this.$axios.put(url, payload).then(() => {
        commit("setBasicField", payload);
      });
    } catch (err) {
      console.log(err);
    }
  },
  async updatePropertyDetail({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/property-detail/${payload.apn}/`;
    let method = "put";
    console.log(payload);
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  async updatePropertyPrice({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/property-price/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  async createPropertyPrice({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/property-price/`;
    let method = "post";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  async createPropertyFile({ commit }, payload) {
    let url = `/api/v1/property-detail-file/`;
    let method = "post";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  async updatePropertyDetailFile({ commit }, payload) {
    let url = `/api/v1/property-detail-file/${payload.id}/`;
    let method = "put";
    return await this.$axios[method](url, payload).then((res) => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};
