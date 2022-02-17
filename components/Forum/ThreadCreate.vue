<template>
  <div class="content">
    <div class="container">
      <div class="row">
        <card card-body-classes="table-full-width">
          <div class="col-md-12">
            <form @submit.prevent="save">
              <h4 class="card-title">Create a Thread</h4>
              <div class="form-row">
                <div class="col-sm-12 col-md-12 mt-3">
                  <div class="form-group">
                    <base-input
                      type="text"
                      label="Title"
                      id="title"
                      v-model="title"
                    ></base-input>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-6 col-md-6">
                  <div class="row">
                    <label>Staff cc:</label>
                  </div>
                  <el-select
                  multiple
                    class="select-primary"
                    filterable
                    size="large"
                    name="status"
                    placeholder="Search here"
                    v-model="staff_carbon_copy"
                  >
                    <el-option
                      v-for="option in optionStaffs"
                      class="select-primary"
                      :value="option.id"
                      :label="option.staff_id"
                      :key="option.staff_id"
                    >
                    </el-option>
                  </el-select>
                </div>

                <div class="col-sm-6 col-md-6">
                  <div class="row">
                    <label>Client cc:</label>
                  </div>
                  <el-select
                  multiple
                    class="select-primary"
                    filterable
                    size="large"
                    name="status"
                    placeholder="Search here"
                    v-model="client_carbon_copy"
                  >
                    <el-option
                      v-for="option in optionClients"
                      class="select-primary"
                      :value="option.id"
                      :label="option.client_code"
                      :key="option.client_code"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-12 mt-3">
                  <label>Description</label>
                  <textarea class="form-control" v-model="content" required>
                  </textarea>
                </div>
              </div>

              <div slot="footer">
                <div class="pull-left">
                  <nuxt-link to="/forums">Return back to list</nuxt-link>
                </div>
                <div class="pull-right">
                  <base-button
                    v-if="!loading"
                    native-type="submit"
                    slot="footer"
                    type="submit"
                    round
                    block
                    size="lg"
                  >
                    Save
                  </base-button>
                  <base-button
                    v-else
                    native-type="submit"
                    slot="footer"
                    type="primary"
                    round
                    block
                    size="lg"
                    disabled
                  >
                    Saving...
                  </base-button>
                </div>
              </div>
            </form>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ForumMixin from "@/mixins/ForumMixin.js";
import UserMixin from "@/mixins/UserMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";

export default {
  name: "resolution_create",
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
  },
  mixins: [ForumMixin, UserMixin],
  props: {
    fetch: {
      type: Function,
      description: "Fetch the resolution function ",
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      error: "",
      optionStaffs: [],
      optionClients: [],
      selected: [],
    };
  },
  methods: {
    ...mapActions("forum", ["resetThread", "saveThread"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchAllStaff() {
      try {
        await this.$store.dispatch("user/fetchStaffCode");
        this.optionStaffs = this.staffs;
        console.log(this.staffs);
      } catch (e) {
        throw e;
      }
    },
    async fetchAllClientCode() {
      try {
        await this.$store.dispatch("user/fetchClientCode");
        this.optionClients = this.clients;
        console.log(this.clients);
      } catch (e) {
        throw e;
      }
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (this.$auth.user.designation_category != "staff") {
          const payload = {
            title: this.title,
            content: this.content,
            author: this.$auth.user.id,
            staff_carbon_copy: this.staff_carbon_copy,
            client_carbon_copy: this.client_carbon_copy,
          };
          try {
            let response = await this.saveThread(payload);
            console.log(response);
            this.loading = false;
            this.resetThread();
          } catch (err) {
            console.error(err);
            this.loading = false;
            this.success = false;
            this.error = err;
            this.errorMessage("danger", err.response.data);
          }
        } else {
          const payload = {
            title: this.title,
            content: this.content,
            author: this.$auth.user.id,
            staff_carbon_copy: this.staff_carbon_copy,
            client_carbon_copy: this.client_carbon_copy,
          };
          await this.saveThread(payload);
          this.loading = false;
          this.resetThread();
          this.$validator.reset();
        }
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.date_submitted
          ? "Title: " + error.title
          : error.category
          ? "author: " + error.author
          : error.staff_carbon_copy
          ? "Staff cc: " + error.staff_carbon_copy
          : error.client_carbon_copy
          ? "Client cc: " + error.client_carbon_copy
          : error.detail
          ? "Detail: " + error.detail
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  mounted() {
    this.fetchAllStaff();
    this.fetchAllClientCode();
  },
};
</script>

<style scoped>
.staff-cc {
  margin-bottom: 0px !important;
}
</style>
