<template>
  <div class="content">
    <div class="container">
      <b-overlay :show="show" rounded="sm">
        <div class="row">
          <card card-body-classes="table-full-width">
            <div class="col-md-12">
              <form @submit.prevent="save">
                <h2 class="card-title">{{ thread.title }}</h2> <div class="pull-right">
                  <nuxt-link to="/forums">Return back to list</nuxt-link>
                </div>
                <hr />
                <div class="form-row">
                  <div class="col-sm-12 col-md-12">
                    <b-form-input
                      v-model="thread.author_username"
                      lazy-formatter
                      plaintext
                      v-b-tooltip.hover
                      title="Author"
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
              <hr />
              <!-- comment goes here -->
              <div class="col-md-12">
                <forum-comment
                  :thread-comment="thread"
                  :fetch="refresh"
                ></forum-comment>
              </div>
            </div>
          </card>
        </div>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ForumMixin from "@/mixins/ForumMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";

import ForumComment from "@/components/Forum/ForumComment.vue";

export default {
  name: "resolution_create",
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
    ForumComment,
  },
  mixins: [ForumMixin],
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      error: "",
      show: false,
    };
  },
  methods: {
    ...mapActions("forum", ["reset", "saveResolution"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClientUser", id);
      } catch (e) {
        this.errorMessage("danger", e.response.data);
      }
    },
    async fetchThreadComment(id) {
      try {
        await this.$store.dispatch("forum/fetchThread", id);
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
      this.show = true;
      try {
        await this.$store.dispatch("forum/fetchThread", id);
        this.show = false;
      } catch (e) {
        this.show = false;
        this.errorMessage("danger", e.response.data);
      }
    },
    refresh() {
      this.fetchThreadComment(this.$route.params.id);
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
        error.thread
          ? "Thread: " + error.thread
          : error.author
          ? "Author: " + error.author
          : error.comment
          ? "Comment: " + error.comment
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
