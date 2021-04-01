<template>
  <div id="comment-section">
    <div class="col-md-12">
      <form @submit.prevent="save">
        <base-alert v-if="error" type="danger" dismissible>
          <span>
            {{ errorMessage(error) }}
          </span>
        </base-alert>

        <div class="form-row">
          <base-table
            :data="job.job_order_category_comments"
            thead-classes="text-primary"
          >
            <template slot-scope="{ row }">
              <td>
                <p class="title">{{ row.commenter }}</p>
                <p class="text-muted comment">{{ row.comment }}</p>
              </td>
            </template>
          </base-table>
        </div>

        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <textarea
              class="form-control"
              placeholder="Comment"
              v-model="comment"
              required
            >
            </textarea>
          </div>
        </div>

        <div slot="footer">
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
              Post
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
              Posting...
            </base-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CreateJobCategoryMixin from "@/mixins/CreateJobOrderCategoryMixin.js";
import { DatePicker, Select } from "element-ui";
import { BaseAlert } from "@/components";
import { BaseTable } from "@/components";

export default {
  components: {
    BaseTable,
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
  },
  mixins: [CreateJobCategoryMixin],
  props: {
    staff: {
      type: Object,
      decription: "Staff data",
    },
    client: {
      type: Object,
      description: "Client data",
    },
    fetch: {
      type: Function,
    },
    job: {
      type: Object,

      description: "Job order object data",
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: "",
    };
  },
  methods: {
    ...mapActions("jobOrderCategory", ["reset", "saveJobOrderCategory"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async refresh(id) {
      await this.$store.dispatch("jobOrderCategory/fetchJobOrderCategory", this.job.ticket_number);
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
          try {
            await this.$axios
              .post(`/api/v1/job-order-category/${this.job.id}/comment/`, {
                comment: this.comment,
              })
              .then(() => {
                this.loading = false;
                this.success = true;
                this.comment = "";
                this.fetch();
                this.refresh(this.job.id);
              });
          } catch (err) {
            console.log(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          await this.$axios
            .post(`/api/v1/job-order-category/${this.job.id}/comment/`, {
              comment: this.comment,
            })
            .then(() => {
              this.loading = false;
              this.success = true;
              this.comment = "";
              this.fetch();
              this.refresh(this.job.id);
            });
          this.reset();
          this.fetch();
        }
      }
    },
    errorMessage(error) {
      if (error.job_order) {
        return "job_order: " + this.error.job_order;
      } else if (error.user) {
        return "User: " + this.error.user;
      } else if (error.comment) {
        return "Comment: " + this.error.comment;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  computed: {
    comment: {
      get() {
        return this.$store.getters["jobOrderCategory/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      },
    },
  },
};
</script>

<style scoped>
#comment-section { 
  width: 100%;
}
.modal-body {
  margin-top: 35px !important;
}
.comment {
  margin-left: 10px;
}
</style>
