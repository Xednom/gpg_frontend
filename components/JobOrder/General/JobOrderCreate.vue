<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create job order</h4>
      <base-alert v-if="error" type="danger" dismissible>
        <span>
          {{ errorMessage(error) }}
        </span>
      </base-alert>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            v-validate="'required'"
            :error="getError('request_date')"
            name="request_date"
            label="Request date"
          >
            <el-date-picker
              v-model="job.request_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Due date"
            v-validate="'required'"
            :error="getError('due_date')"
            name="due_date"
          >
            <el-date-picker
              v-model="job.due_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Job title"
            v-validate="'required'"
            :error="getError('job_title')"
            name="job_title"
            v-model="job.job_title"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="job.job_description"
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
            type="primary"
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
</template>

<script>
import { mapActions } from "vuex";
import CreateJobMixin from "@/mixins/CreateJobOrderMixin.js";
import { DatePicker, Select } from "element-ui";
export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
  },
  mixins: [CreateJobMixin],
  props: {
    staff: {
      type: Object,
      decription: "Staff data",
    },
    client: {
        type: Object,
        description: "Client data"
    },
    fetch: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      job: {
        request_date: "",
        due_date: "",
        job_title: "",
        job_description: "",
        client_notes: "",
      },
    };
  },
  methods: {
    ...mapActions("jobOrder", ["reset", "saveJobOrder"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async save() {
      this.loading = true;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        const payload = {
          client: this.client.id,
          request_date: this.job.request_date,
          due_date: this.job.due_date,
          job_title: this.job.job_title,
          job_description: this.job.job_description,
          client_notes: this.job.client_notes,
        };
        await this.saveJobOrder(payload);
        this.loading = false;
        this.fetch();
        this.reset();
      } else {
        const payload = {
          va_assigned: this.staff.id,
          request_date: this.job.request_date,
          due_date: this.job.due_date,
          job_title: this.job.job_title,
          job_description: this.job.job_description,
          client_notes: this.job.client_notes,
        };
        await this.saveJobOrder(payload);
        this.loading = false;
        this.fetch();
        this.reset();
      }
    },
    errorMessage(error) {
      if (error.password) {
        return "Password: " + this.error.password;
      } else if (error.username) {
        return "Username: " + this.error.username;
      } else if (error.detail) {
        return "Detail: " + this.error.detail;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
};
</script>
