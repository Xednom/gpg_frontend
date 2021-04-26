<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Account file information:</h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="file.file_name" label="File name" disabled>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="URL" v-model="file.url" disabled>
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>File description</label>
          <textarea
            class="form-control"
            placeholder="Notes"
            v-model="file.file_description"
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
    file: {
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
