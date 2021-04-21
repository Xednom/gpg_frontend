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
          <base-input v-model="details" label="Details">
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="URL" v-model="url">
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Description</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="description"
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
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";

export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    file: {
      type: Object,
      decription: "Property price data id",
    },
    user: {
        type: Object,
        description: "User data"
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
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["createPropertyFile", "reset"]),
    async save() {
      const payload = {
        property_detail: this.file.id,
        details: this.details,
        url: this.url,
        description: this.description,
      };
      await this.createPropertyFile(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
          this.reset();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
  },
  computed: {
    details: {
      get() {
        return this.$store.getters["propertyDetail/details"];
      },
      set(value) {
        this.setBasicStoreValue("details", value);
      },
    },
    url: {
      get() {
        return this.$store.getters["propertyDetail/url"];
      },
      set(value) {
        this.setBasicStoreValue("url", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["propertyDetail/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
  },
};
</script>
