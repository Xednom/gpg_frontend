const blankState = {
    ticket_number: "",
    client: null,
    dd_link: "",
    assessor_website: "",
    assessor_contact: "",
    treasurer_website: "",
    treasurer_contact: "",
    recorder_clerk_website: "",
    recorder_clerk_contact: "",
    zoning_or_planning_department_website: "",
    zoning_or_planning_department_contact: "",
    county_environmental_health_department_website: "",
    county_environmental_health_department_contact: "",
    gis_website: "",
    cad_website: "",
    electricity_company_name_and_phone_number: "",
    water_company_name_and_phone_number: "",
    sewer_company_name_and_phone_number: "",
    gas_company_name_and_phone_number: "",
    waste_company_name_and_phone_number: "",
    apn: "",
    county: "",
    state: "",
    memo_call_notes: "",
    dd_specialists_additional_info: "",
    staff_initial_dd: "",
    initial_due_diligence_status: "",
    initial_dd_date_complete: "",
    staff_assigned_for_call_out: null,
    call_out_status: "",
    call_out_dd_date_complete: "",
  };
  
  export const state = () => ({
    ...blankState,
    callOuts: [],
    callOut: {},
    callOutsPagination: {
      offset: 0,
      count: 0,
      showing: 0,
      currentPage: 1,
    },
  });
  
  export const getters = {
    ticket_number: (state) => state.ticket_number,
    client: (state) => state.client,
    dd_link: (state) => state.dd_link,
    assessor_website: (state) => state.assessor_website,
    assessor_contact: (state) => state.assessor_contact,
    treasurer_website: (state) => state.treasurer_website,
    treasurer_contact: (state) => state.treasurer_contact,
    recorder_clerk_website: (state) => state.recorder_clerk_website,
    recorder_clerk_contact: (state) => state.recorder_clerk_contact,
    zoning_or_planning_department_website: (state) => state.zoning_or_planning_department_website,
    zoning_or_planning_department_contact: (state) => state.zoning_or_planning_department_contact,
    county_environmental_health_department_website: (state) => state.county_environmental_health_department_website,
    county_environmental_health_department_contact: (state) => state.county_environmental_health_department_contact,
    gis_website: (state) => state.gis_website,
    cad_website: (state) => state.cad_website,
    electricity_company_name_and_phone_number: (state) => state.electricity_company_name_and_phone_number,
    water_company_name_and_phone_number: (state) => state.water_company_name_and_phone_number,
    sewer_company_name_and_phone_number: (state) => state.sewer_company_name_and_phone_number,
    gas_company_name_and_phone_number: (state) => state.gas_company_name_and_phone_number,
    waste_company_name_and_phone_number: (state) => state.waste_company_name_and_phone_number,
    apn: (state) => state.apn,
    county: (state) => state.county,
    state: (state) => state.state,
    memo_call_notes: (state) => state.memo_call_notes,
    dd_specialists_additional_info: (state) => state.dd_specialists_additional_info,
    staff_initial_dd: (state) => state.staff_initial_dd,
    initial_due_diligence_status: (state) => state.initial_due_diligence_status,
    initial_dd_date_complete: (state) => state.initial_dd_date_complete,
    staff_assigned_for_call_out: (state) => state.staff_assigned_for_call_out,
    call_out_status: (state) => state.call_out_status,
    call_out_dd_date_complete: (state) => state.call_out_dd_date_complete,
    callOutsPagination: (state) => state.callOutsPagination,
    callOuts: (state) => state.callOuts,
    callOut: (state) => {
      return state.callOut;
    },
  };
  
  export const mutations = {
    setCallOut(state, payload) {
      state.callOut = payload.callOut;
    },
    setCallOuts(state, payload) {
      state.callOuts = payload.callOuts;
    },
    setCallOutsPagination(state, payload) {
      state.callOutsPagination = payload;
    },
    setCallOuts(state, payload) {
      state.callOuts = payload.callOuts;
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
    async fetchCallOuts({ commit, dispatch }, params) {
      return await this.$axios
        .get("/api/v1/call-out/", { params: params })
        .then((res) => {
          commit("setCallOuts", { callOuts: res.data.results });
          const offset = getOffset(res.data.previous);
          commit("setCallOutsPagination", {
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
    async fetchCallOut({ commit, dispatch }, payload) {
      let endpoint = `/api/v1/call-out/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          commit("setJobOrderCategory", { callOut: res.data });
        })
        .catch((e) => {
          throw e;
        });
    },
    async updateCallOut({ commit }, payload) {
      console.log(payload.id);
      let url = `/api/v1/call-out/${payload.id}/`;
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
  