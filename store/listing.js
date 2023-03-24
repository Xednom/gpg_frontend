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
  tagging: "",
  listing_sites: "",
  listing_status: "",
  assigned_to: null,
};

export const state = () => ({
  ...blankState,
  listings: [],
  listing: {},
  leadAssignedTo: {},
  listingFile: {},
  listingStatus: [],
  listingsPagination: {
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
  tagging: (state) => state.tagging,
  listing_sites: (state) => state.listing_sites,
  listing_status: (state) => state.listing_status,
  assigned_to: (state) => state.assigned_to,
  listingsPagination: (state) => state.listingsPagination,
  listingStatus: (state) => state.listingStatus,
  listings: (state) => state.listings,
  listing: (state) => {
    return state.listing;
  },
};

export const mutations = {
  setListing(state, payload) {
    state.listing = payload.listing;
  },
  setListings(state, payload) {
    state.listings = payload.listings;
  },
  setListingStatus(state, payload) {
    state.listingStatus = payload.listingStatus;
  },
  setListingsPagination(state, payload) {
    state.listingsPagination = payload;
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
  async fetchListing({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/listing/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setListing", { listing: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchListings({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/listing/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setListings", { listings: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setListingsPagination", {
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
  async fetchListingStatus({ commit, dispatch }) {
    let endpoint = `/api/v1/listing-status/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setListingStatus", { listingStatus: res.data.results });
        console.warn("setListingStatus: ", { listingStatus: res.data.results })
      })
      .catch((e) => {
        throw e;
      });
  },
  async saveListing({ commit, dispatch }, payload) {
    let url = "/api/v1/listing/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveListings({ commit, dispatch }, payload) {
    let url = "/api/v1/save-listings/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteListing({ commit, dispatch }, payload) {
    let url = `/api/v1/listing/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateListing({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/listing/${payload.id}/`;
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
