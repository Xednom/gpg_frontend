<template>
  <div class="col-md-12">
    <base-alert v-if="success" type="success" dismissible>
      <span>
        {{ successMessage() }}
      </span>
    </base-alert>
    <form @submit.prevent="save">
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="file.details" label="Details">
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="URL" v-model="file.url">
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Description</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="file.description"
          >
          </textarea>
        </div>
      </div>
      <div slot="footer">
        <div class="pull-right mt-5">
          <base-button
            v-if="!saving"
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
</template>

<script>
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { mapActions } from "vuex";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    file: {
      type: Object,
      decription: "Property detail files data",
    },
    fetch: {
      type: Function,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["updatePropertyDetailFile"]),
    async save() {
      const payload = {
        id: this.file.id,
        details: this.file.details,
        url: this.file.url,
        description: this.file.description,
      };
      await this.updatePropertyDetailFile(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully updated this Property detail file data.";
    },
  },
};
</script>
