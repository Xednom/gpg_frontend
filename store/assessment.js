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
  packets: "",
  comps_by_parcel: "",
  comps_by_area: "",
  due_diligence: "",
  assigned_to: null,
};

export const state = () => ({
  ...blankState,
  assessments: [],
  assessment: {},
  leadAssignedTo: {},
  assessmentFile: {},
  assessmentsPagination: {
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
  packets: (state) => state.packets,
  comps_by_parcel: (state) => state.comps_by_parcel,
  comps_by_area: (state) => state.comps_by_area,
  notes: (state) => state.notes,
  due_diligence: (state) => state.due_diligence,
  assigned_to: (state) => state.assigned_to,
  assessmentsPagination: (state) => state.assessmentsPagination,
  assessments: (state) => state.assessments,
  assessment: (state) => {
    return state.assessment;
  },
};

export const mutations = {
  setAssessment(state, payload) {
    state.assessment = payload.assessment;
  },
  setAssessments(state, payload) {
    state.assessments = payload.assessments;
  },
  setAssessmentsPagination(state, payload) {
    state.assessmentsPagination = payload;
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
  async fetchAssessment({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/assessment/${payload}/`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setAssessment", { assessment: res.data });
      })
      .catch((e) => {
        throw e;
      });
  },
  async fetchAssessments({ commit, dispatch }, payload) {
    let endpoint = `/api/v1/assessment/?search=${payload}`;
    return await this.$axios
      .get(endpoint)
      .then((res) => {
        commit("setAssessments", { assessments: res.data.results });
        const offset = getOffset(res.data.previous);
        commit("setAssessmentsPagination", {
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
  async saveAssessment({ commit, dispatch }, payload) {
    let url = "/api/v1/assessment/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async saveassessments({ commit, dispatch }, payload) {
    let url = "/api/v1/save-assessments/";
    await this.$axios.post(url, payload).then((res) => {
      commit("setBasicField", res.data);
      return res.data;
    });
  },
  async deleteAssessment({ commit, dispatch }, payload) {
    let url = `/api/v1/assessment/${payload}/`;
    try {
      await this.$axios.delete(url, payload);
    } catch (err) {
      console.error(err);
    }
  },
  async updateAssessment({ commit }, payload) {
    console.log(payload);
    let url = `/api/v1/assessments/${payload.id}/`;
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
