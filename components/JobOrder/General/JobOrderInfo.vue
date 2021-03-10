<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Job order informations: Ticket #<b>{{ job.ticket_number }}</b></h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="job.request_date" label="Request date" disabled>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="Due date" v-model="job.due_date" disabled>
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input
            v-model="job.date_completed"
            label="Date completed"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input
            label="Total time consumed"
            v-model="job.total_time_consumed"
            disabled
          >
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input label="Status" v-model="job.status" disabled>
          </base-input>
        </div>

        <div class="col-sm-12 col-md-6"></div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input label="Job title" v-model="job.job_title" disabled>
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Job Description</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="job.job_description"
            disabled
          >
          </textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { DatePicker } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
  },
  props: {
    job: {
      type: Object,
      decription: "Job order data",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
