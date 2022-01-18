<template>
  <div class="col-md-12">
    <div class="col-md-12" v-if="!isGeneralScoring">
      <form @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <label>Accuracy:</label>
            <b-form-rating v-model="accuracy"></b-form-rating>
          </div>
          <div class="col-sm-12 col-md-12 mt-3">
            <label>Speed:</label>
            <b-form-rating v-model="speed"></b-form-rating>
          </div>
          <div class="col-sm-12 col-md-12 mt-3">
            <label>Quality of work:</label>
            <b-form-rating v-model="quality_of_work"></b-form-rating>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="delivered_on_time"
              >Delivered on time?</b-form-checkbox
            >
          </div>
          <div class="col-sm-12 col-md-12 mt-3" v-if="!delivered_on_time">
            <label>Delivery issue/note</label>
            <textarea cols="30" rows="10" v-model="delivery_note"></textarea>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="job_completed"
              >Job completed</b-form-checkbox
            >
          </div>
          <div class="col-sm-12 col-md-12 mt-3" v-if="!job_completed">
            <label>Job completed issue/note</label>
            <textarea
              cols="30"
              rows="10"
              v-model="job_completed_note"
            ></textarea>
            <b-form-text id="input-live-help"
              >Was the job completed based on your instruction or
              expectations?</b-form-text
            >
          </div>
        </div>

        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="satisfied">Satisfied</b-form-checkbox>
          </div>
        </div>

        <div slot="footer">
          <div class="pull-right mt-3">
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
    <div class="col-md-12" v-else-if="isGeneralScoring">
      <div v-for="item in job.job_order_general_scorings" :key="item.id">
        <h4 class="card-title">
          <center>Thank you for giving us a review &hearts;</center>
        </h4>

        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <label>Accuracy:</label>
            <b-form-rating v-model="item.accuracy" disabled></b-form-rating>
          </div>
          <div class="col-sm-12 col-md-12 mt-3">
            <label>Speed:</label>
            <b-form-rating v-model="item.speed" disabled></b-form-rating>
          </div>
          <div class="col-sm-12 col-md-12 mt-3">
            <label>Quality of work:</label>
            <b-form-rating
              v-model="item.quality_of_work"
              disabled
            ></b-form-rating>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="item.delivered_on_time" disabled
              >Delivered on time?</b-form-checkbox
            >
          </div>
          <div class="col-sm-12 col-md-12 mt-3" v-if="!item.delivered_on_time">
            <label>Delivery issue/note</label>
            <textarea
              cols="30"
              rows="10"
              v-model="item.delivery_note"
              disabled
            ></textarea>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="item.job_completed" disabled
              >Job completed</b-form-checkbox
            >
          </div>
          <div class="col-sm-12 col-md-12" v-if="!item.job_completed">
            <label>Job completed issue/note</label>
            <textarea
              cols="30"
              rows="10"
              v-model="item.job_completed_note"
              disabled
            ></textarea>
            <b-form-text id="input-live-help"
              >Was the job completed based on your instruction or
              expectations?</b-form-text
            >
          </div>
        </div>

        <div class="form-row">
          <div class="col-sm-12 col-md-12 mt-3">
            <b-form-checkbox v-model="item.satisfied" disabled
              >Satisfied</b-form-checkbox
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CreateAgentScoringMixin from "@/mixins/CreateAgentScoringMixin.js";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { debounce } from "lodash";

export default {
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  mixins: [CreateAgentScoringMixin],
  props: {
    client: {
      type: Number,
      description: "Client id",
    },
    fetch: {
      type: Function,
    },
    job: {
      type: Object,
      description: "Job Order data",
    },
    type: {
      type: String,
      description: "Type of job order",
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      balance: "",
      query: "",
      selectedClientCode: "",
      clientUser: {},
      clientCodes: [],
      job: {
        request_date: "",
        due_date: "",
        job_title: "",
        job_description: "",
        client_notes: "",
      },
      error: "",
    };
  },
  methods: {
    ...mapActions("agentScoring", [
      "reset",
      "saveGeneralScore",
      "saveCategoryScore",
    ]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    getClientCode: debounce(function() {
      this.$axios
        .get(`/api/v1/client-code/?search=${this.query}`)
        .then((res) => {
          this.clientCodes = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 700),
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      this.$forceUpdate();
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          try {
            if (this.type == "general") {
              const payload = {
                staff: this.job.va_assigned,
                client: this.clientUser.id,
                job_order_general: this.job.ticket_number,
                accuracy: this.accuracy,
                speed: this.speed,
                quality_of_work: this.quality_of_work,
                delivered_on_time: this.delivered_on_time,
                delivery_note: this.delivery_note,
                job_completed: this.job_completed,
                job_completed_note: this.job_completed_note,
                satisfied: this.satisfied,
              };
              await this.saveGeneralScore(payload).then(() => {
                this.loading = false;
                this.success = true;
                this.$emit("refresh", this.job.ticket_number);
                this.successMessage("success");
                this.reset();
                this.query = null;
                this.$validator.reset();

                this.fetch();
              });
            } else if (this.type == "category") {
              const payload = {
                staff: this.jobOrder.va_assigned,
                client: this.clientUser.id,
                job_order_category: this.jobOrder.ticket_number,
                accuracy: this.accuracy,
                speed: this.speed,
                quality_of_work: this.quality_of_work,
                delivered_on_time: this.delivered_on_time,
                delivery_note: this.delivery_note,
                job_completed: this.job_completed,
                job_completed_note: this.job_completed_note,
                satisfied: this.satisfied,
              };
              await this.saveCategoryScore(payload);
              this.loading = false;
              this.successMessage("success");
              this.query = "";
              this.reset();
              this.$validator.reset();
              this.fetch();
            }
          } catch (err) {
            console.error(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        }
      }
    },
    deficitMessage(variant = null) {
      this.$bvToast.toast(
        "Your account is in deficit status. For you to continue using the service, please refill your account by going to TIMESHEET under Account Balance you can see the link to make a payment. Thank you.",
        {
          title: `Please be advised`,
          variant: variant,
          solid: true,
        }
      );
    },
    successMessage(variant = null) {
      this.$bvToast.toast(
        "You have successfully scored the staff in this job order!",
        {
          title: `Thank you!`,
          variant: variant,
          solid: true,
        }
      );
    },
    errorMessage(error) {
      if (error.request_date) {
        return "Request date: " + this.error.request_date;
      } else if (error.due_date) {
        return "due_date: " + this.error.due_date;
      } else if (error.job_title) {
        return "Job title: " + this.error.job_title;
      } else if (error.job_description) {
        return "Job description: " + this.error.job_decription;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  computed: {
    isGeneralScoring() {
      if (this.job.job_order_general_scorings) {
        if (this.job.job_order_general_scorings.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    isCategoryScoring() {
      if (this.job.job_order_category_scorings) {
        if (this.job.job_order_category_scorings.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    },
  },
  mounted() {
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  },
};
</script>
