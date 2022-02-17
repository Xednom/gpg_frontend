<template>
  <div class="content">
    <div class="container">
      <div class="row">
        <card card-body-classes="table-full-width">
          <div class="col-md-12">
            <form @submit.prevent="save">
              <h2 class="card-title">{{ thread.title }}</h2>
              <hr />
              <div class="form-row">
                <div class="col-sm-12 col-md-12">
                  <b-form-input
                    v-model="thread.author_name"
                    lazy-formatter
                    plaintext
                  ></b-form-input>
                </div>
                <div class="col-sm-12 col-md-12 mt-3">
                  <blockquote>
                    <b-form-textarea
                      id="textarea-plaintext"
                      plaintext
                      :value="thread.content"
                    ></b-form-textarea>
                  </blockquote>
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
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      resolution: {},
      balance: "",
      query: "",
      error: "",
    };
  },
  methods: {
    ...mapActions("forum", ["reset", "saveResolution"]),
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
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          const payload = {
            id: this.resolution.id,
            additional_notes: this.resolution.additional_notes,
          };
          try {
            if (this.balance < 0) {
              this.loading = false;
              this.deficitMessage("danger");
            } else {
              let response = await this.saveResolution(payload);
              console.log(response);
              this.loading = false;
              this.successMessage("success");
              this.reset();
              this.$validator.reset();
            }
          } catch (err) {
            console.error(err);
            this.loading = false;
            this.success = false;
            this.error = err;
            this.errorMessage("danger", err.response.data);
          }
        } else {
          const payload = {
            id: this.resolution.id,
            additional_notes: this.resolution.additional_notes,
          };
          await this.saveResolution(payload);
          this.loading = false;
          this.reset();
          this.$validator.reset();
          this.fetch();
        }
      }
    },
    async fetchThread(id) {
      try {
        await this.$store.dispatch("forum/fetchThread", id);
        console.log(this.thread);
      } catch (e) {
        this.errorMessage("danger", e.response.data);
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("A successful update", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.date_submitted
          ? "Date submitted: " + error.date_submitted
          : error.category
          ? "Category: " + error.category
          : error.description
          ? "Description: " + error.description
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
    this.fetchThread(this.$route.params.id);
  },
};
</script>
