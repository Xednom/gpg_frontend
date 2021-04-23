<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Account information:</h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="account.category" label="Category" disabled>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="URL" v-model="account.url" disabled>
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input
            v-model="account.username"
            label="Username"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input
            label="Password"
            v-model="account.password"
            disabled
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Notes</label>
          <textarea
            class="form-control"
            placeholder="Notes"
            v-model="account.notes"
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
    account: {
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
