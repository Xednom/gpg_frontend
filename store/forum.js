const threadState = {
    title: "",
    content: "",
    author: null,
    staff_carbon_copy: [],
    client_carbon_copy: [],
    is_active: true,
  };
  
  export const state = () => ({
    ...threadState,
    threads: [],
    thread: {},
  });
  
  export const getters = {
    title: state => state.title,
    content: state => state.content,
    author: state => state.author,
    staff_carbon_copy: state => state.staff_carbon_copy,
    client_carbon_copy: state => state.client_carbon_copy,
    is_active: state => state.is_active,
    threads: state => state.threads,
    thread: state => {
        return state.thread
    }
  };
  
  export const mutations = {
    setThread(state, payload) {
      state.thread = payload.thread;
    },
    setThreads(state, payload) {
      state.threads = payload.threads;
    },
    setBasicField(state, {field, value}) {
      state[field] = value;
    },
    resetThread(state) {
      Object.assign(state, threadState);
    }
  };
  
  function getOffset(urlStr) {
    if (!urlStr) {
      return 0;
    }
    const url = new URL(urlStr);
    return parseInt(url.searchParams.get("offset"));
  }
  
  export const actions = {
    async fetchThreads({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/thread/", { params: params })
        .then(res => {
          commit("setThreads", { threads: res.data.results });
          console.log(res.data.results);
          return res;
        })
        .catch(e => {
          throw e;
        });
    },
    async fetchThread({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/thread/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then(res => {
          commit("setThread", { thread: res.data });
        })
        .catch(e => {
          throw e;
        });
    },
    async saveThread({ commit }, payload) {
      let url = "/api/v1/thread/";
      try {
        return await this.$axios.post(url, payload).then(() => {
          this.$router.push({
            name: "forums-id___en",
            params: { id: res.data.id }
          });
          commit("setBasicField", payload);
        })
      } catch(err) {
        console.error(err)
      }
    },
    resetThread({commit}) {
      commit("resetThread");
    }
  };
  