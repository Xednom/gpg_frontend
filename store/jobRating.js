const blankState = {
  job_order: null,
  rating: 0,
  comment: "",
  client: null,
};

export const state = () => ({
  ...blankState,
  ratings: [],
  rating: {},
});

export const getters = {
  job_order: (state) => state.job_order,
  rating: (state) => state.rating,
  comment: (state) => state.comment,
  client: (state) => state.client,
  ratings: (state) => state.ratings,
  rating: (state) => {
    return state.rating;
  },
};

export const mutations = {
  setRating(state, payload) {
    state.rating = payload.rating;
  },
  setRatings(state, payload) {
    state.ratings = payload.ratings;
  },
  setRatingsPagination(state, payload) {
    state.ratingsPagination = payload;
  },
  setBasicField(state, { field, value }) {
    state[field] = value;
  },
  reset(state) {
    Object.assign(state, blankState);
  },
};
export const actions = {
  async saveJobOrderGeneralRating({ commit, dispatch }, payload) {
    let url = `/api/v1/job-order-general/${payload.id}/rating/`;
    await this.$axios.post(url, payload).then((res) => {
      return res.data;
    });
  },
  async saveobOrderCategoryRating({ commit }, payload) {
    let url = `/api/v1/job-order-category/${payload.id}/rating`;
    let method = "put";
    console.log(payload);
    return await this.$axios.post(url, payload).then((res) => {
      return res.data;
    });
  },
  reset({ commit }) {
    commit("reset");
  },
};
