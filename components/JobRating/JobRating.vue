<template>
  <div class="col-md-12">
    <div id="rating-section" v-if="isJobRating">
      <div class="col-md-12">
        <div class="form-row">
          <base-table
            :data="job.job_general_ratings"
            thead-classes="text-primary"
            v-if="job.job_general_ratings != []"
          >
            <template slot-scope="{ row }" v-if="row.rating">
              <td>
                <p class="title">
                  <label>Rate:</label>
                  <b-form-rating
                    class="job-rate"
                    v-model="row.rating"
                    color="#ff8800"
                    readonly
                  ></b-form-rating>
                </p>
                <hr />
                <p class="text-muted comment ">{{ row.comment }}</p>
              </td>
            </template>
          </base-table>
        </div>
      </div>
    </div>
    <div id="rating-section" v-else-if="isJobOrderCatRating">
      <div class="col-md-12">
        <div class="form-row">
          <base-table
            :data="job.job_category_ratings"
            thead-classes="text-primary"
            v-if="job.job_general_ratings != []"
          >
            <template slot-scope="{ row }" v-if="row.rating">
              <td>
                <p class="title">
                  <label>Rate:</label>
                  <b-form-rating
                    class="job-rate"
                    v-model="row.rating"
                    color="#ff8800"
                    readonly
                  ></b-form-rating>
                </p>
                <hr />
                <p class="text-muted comment ">{{ row.comment }}</p>
              </td>
            </template>
          </base-table>
        </div>
      </div>
    </div>
    <div v-else-if="!isJobRating">
      <form class="mt-5" @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <label>How do you feel about this task?</label>
            <b-form-rating
              class="job-rate"
              v-model="rating"
              color="#ff8800"
            ></b-form-rating>
          </div>
          <div class="col-md-12 col-sm-12">
            <b-form-textarea
              class="form-control"
              placeholder="Comment"
              v-model="comment"
              rows="5"
              max-rows="15"
              required
            >
            </b-form-textarea>
          </div>
        </div>

        <div slot="footer">
          <div class="pull-right">
            <b-button
              class="btn-rate"
              v-if="!saving"
              variant="success"
              type="submit"
              >Submit review</b-button
            >
            <b-button
              v-else
              class="btn-rate"
              variant="success"
              type="submit"
              disabled
              >Submitting...</b-button
            >
          </div>
        </div>
      </form>
    </div>
    <div v-else-if="!isJobOrderCatRating">
      <form class="mt-5" @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <label>How do you feel about this task?</label>
            <b-form-rating
              class="job-rate"
              v-model="rating"
              color="#ff8800"
            ></b-form-rating>
          </div>
          <div class="col-md-12 col-sm-12">
            <b-form-textarea
              class="form-control"
              placeholder="Comment"
              v-model="comment"
              rows="5"
              max-rows="15"
              required
            >
            </b-form-textarea>
          </div>
        </div>

        <div slot="footer">
          <div class="pull-right">
            <b-button
              class="btn-rate"
              v-if="!saving"
              variant="success"
              type="submit"
              >Submit review</b-button
            >
            <b-button
              v-else
              class="btn-rate"
              variant="success"
              type="submit"
              disabled
              >Submitting...</b-button
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CreateJobRatingMixin from "@/mixins/CreateJobRatingMixin.js";
import { DatePicker, Select } from "element-ui";
import { BaseAlert } from "@/components";
import { BaseTable } from "@/components";
import { event } from 'd3';

export default {
  name: "JobRating",
  components: {
    BaseTable,
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
  },
  mixins: [CreateJobRatingMixin],
  props: {
    clientId: {
      type: Number,
      description: "Client id",
    },
    ticket: {
      type: String,
    },
    job: {
      type: Object,
      description: "Job order object data",
    },
    type: {
      type: String,
      description: "Job order type[general, category]",
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
    ...mapActions("jobRating", [
      "reset",
      "saveJobOrderGeneralRating",
      "saveJobOrderCategoryRating",
    ]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    isInclude(rating) {
      return this.hasJobRating.includes(rating);
    },

    successMessage(variant = null) {
      this.$bvToast.toast("Thank you for writing a review!", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.job_order
          ? "Job Order: " + error.job_order
          : error.detail
          ? "Detail: " + error.detail
          : error.rating
          ? "Rating: " + error.rating
          : error.comment
          ? "Comment: " + error.comment
          : error.client
          ? "Client: " + error.client
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
    async test() {
      console.log(this.type);
    },
    async save() {
      this.saving = true;
      const payload = {
        id: this.job.id,
        job_order: this.job.id,
        rating: this.rating,
        comment: this.comment,
        client: this.clientId,
      };
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        if (this.type == "general") {
          try {
            await this.saveJobOrderGeneralRating(payload);
            this.successMessage("success");
            this.reset();
            this.saving = false;
          } catch (err) {
            console.error(err);
            this.saving = false;
            this.success = false;
            this.errorMessage("danger", err.response.data);
          }
        } else if (this.type == "category") {
          try {
            await this.saveJobOrderCategoryRating(payload);
            this.successMessage("success");
            this.reset();
            this.$emit("refresh", this.ticket);
            this.saving = false;
          } catch (err) {
            console.error(err);
            this.saving = false;
            this.success = false;
            this.errorMessage("danger", err.response.data);
          }
        }
      }
    },
  },
  computed: {
    hasJobRating() {
      return this.job.job_general_ratings.map((item) => item.rating);
    },
    isJobRating() {
      if (this.job.job_general_ratings) {
        if (this.job.job_general_ratings.length == 0) {
          return false;
        } else {
          return true;
        }
      } else if (this.job.job_general_ratings) {
        if (this.job.job_category_ratings.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    isJobOrderCatRating() {
      if (this.job.job_category_ratings) {
        if (this.job.job_category_ratings.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    comment: {
      get() {
        return this.$store.getters["jobRating/comment"];
      },
      set(value) {
        this.setBasicStoreValue("comment", value);
      },
    },
    rating: {
      get() {
        return this.$store.getters["jobRating/rating"];
      },
      set(value) {
        this.setBasicStoreValue("rating", value);
      },
    },
  },
};
</script>

<style scoped>
#rating-section {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}
.modal-body {
  margin-top: 35px !important;
}
.comment {
  margin-left: 10px;
}
.client-comment {
  background-color: #c5e0b4;
}
.staff-comment {
  background-color: #fff2cc;
}
.job-rate {
  border: 0px;
}
.btn-rate {
  border-radius: 0px;
}
</style>
