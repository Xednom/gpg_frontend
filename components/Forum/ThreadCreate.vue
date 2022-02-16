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
                  <label for="tags-basic">Staff cc:</label>
                  <b-form-tags
                    class="staff-cc"
                    input-id="tags-basic"
                    v-model="staff_carbon_copy"
                    placeholder="Enter new tags separated by space"
                    size="sm"
                    separator=" ,;"
                    remove-on-delete
                  ></b-form-tags>
                  {{ staff_carbon_copy }}
                  <b-form-text id="tags-remove-on-delete-help" class="mt-2">
                    Press <kbd>Backspace</kbd> to remove the last tag entered
                  </b-form-text>
                </div>

                <div class="col-sm-6 col-md-6">
                  <label for="tags-basic">Client cc:</label>
                  <b-form-tags
                    class="staff-cc"
                    input-id="tags-basic"
                    v-model="client_carbon_copy"
                    placeholder="Enter new tags separated by space"
                    size="sm"
                    separator=" ,;"
                    remove-on-delete
                  ></b-form-tags>
                  <b-form-text id="tags-remove-on-delete-help" class="mt-2">
                    Press <kbd>Backspace</kbd> to remove the last tag entered
                  </b-form-text>
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
  mixins: [ForumMixin],
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
      staff_carbon_copy: [
        {
          staff_id: "",
        },
      ],
      client_carbon_copy: [
        {
          client_id: "",
        },
      ],
      error: "",
    };
  },
  methods: {
    ...mapActions("forum", ["reset", "saveThread"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchCategory() {
      await this.$store.dispatch("resolution/fetchCategory");
    },
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClientUser", id);
      } catch (e) {
        this.errorMessage("danger", e.response.data);
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
            this.reset();
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
            author: this.author,
            staff_carbon_copy: this.staff_carbon_copy,
            client_carbon_copy: this.client_carbon_copy,
          };
          await this.saveResolution(payload);
          this.loading = false;
          this.reset();
          this.$validator.reset();
          this.fetch();
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
    this.fetchClient(this.$auth.user.id);
    this.fetchCategory();
  },
};
</script>

<style scoped>
.staff-cc {
  margin-bottom: 0px !important;
}
</style>
