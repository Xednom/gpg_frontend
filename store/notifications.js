const blankState = {
  unread: false,
  notif: 0,
};

export const state = () => ({
  ...blankState,
  notifications: [],
});

export const getters = {
  unread: (state) => state.unread,
  notif: (state) => state.notif,
  notificationsPagination: (state) => state.notificationsPagination,
  notifications: (state) => state.notifications,
};

export const mutations = {
  setNotifications(state, payload) {
    state.notifications = payload.notifications;
  },
  setNotificationsPagination(state, payload) {
    state.notificationsPagination = payload;
  },
  setNotif(state, payload) {
    state.notif = payload;
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
  async fetchNotifications({ commit, dispatch }, params) {
    return await this.$axios
      .get("/api/v1/alerts/", { params: params })
      .then((res) => {
        commit("setNotifications", { notifications: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setNotificationsPagination", {
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
  async fetchUnread({commit, dispatch}) {
    this.loading = true;
    let endpoint = `/api/v1/alerts/`;
    let response = await this.$axios.get(endpoint);
    if (response.status == 200) {
      commit("setNotif", response.data.count);
    }
  },
  async unread({ commit }, payload) {
    let url = `/api/v1/alerts/${payload.id}`;
    try {
      console.log(url);
      return await this.$axios.put(url, payload);
    } catch (e) {
      throw e;
    }
  },
  reset({ commit }) {
    commit("reset");
  },
};
