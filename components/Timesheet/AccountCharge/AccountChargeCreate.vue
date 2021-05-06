<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create Account Charge</h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            v-model="shift_date"
            label="Shift date"
            v-validate="'required'"
            name="Shift date"
            :error="getError('Shift date')"
          >
            <el-date-picker
              v-model="shift_date"
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
            label="Job request"
            v-validate="'required'"
            :error="getError('Job request')"
            name="Job request"
            v-model="job_request"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Ticket number"
            v-validate="'required'"
            :error="getError('Ticket number')"
            name="Ticket number"
            v-model="ticket_number"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Hourly rate"
            class="mt-2"
            name="hourly rate"
            required
            v-model="hourly_rate"
            v-validate="modelValidations.hourly_rate"
            :error="getError('hourly rate')"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">

          <base-input
            label="Total items"
            class="mt-2"
            name="Total items"
            required
            v-model="total_items"
            v-validate="modelValidations.total_items"
            :error="getError('Total items')"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">

          <base-input
            label="Total time"
            class="mt-2"
            name="Total time"
            required
            v-model="total_time"
            v-validate="modelValidations.total_time"
            :error="getError('Total time')"
          >
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div
          class="col-sm-12 col-md-12"
          v-if="this.$auth.user.designation_category == 'staff'"
        >
          <label>Client Code</label>
          <vue-typeahead-bootstrap
            class="mb-4"
            v-model="query"
            :ieCloseFix="false"
            :data="clientCodes"
            :serializer="(item) => item.client_code"
            @hit="selectedClientCode = $event"
            :disabledValues="
              selectedClientCode ? [selectedClientCode.client_code] : []
            "
            placeholder="Search client code"
            @input="getClientCode"
          />
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="col-sm-12 col-md-12">
          <textarea
            class="form-control"
            placeholder="Job request description"
            v-model="job_description"
          >
          </textarea>
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
</template>

<script>
import { mapActions } from "vuex";
import CreateAccountChargeMixin from "@/mixins/CreateAccountChargeMixin.js";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

export default {
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
  },
  mixins: [CreateAccountChargeMixin],
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
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      query: "",
      selectedClientCode: "",
      clientUser: {},
      clientCodes: [],
      clientHourlyRate: "",
      error: "",
      modelValidations: {
        hourly_rate: {
          required: true,
          decimal: true,
        },
        total_items: {
          required: true,
          decimal: true,
        },
        total_time: {
          required: true,
          decimal: true,
        },
      },
    };
  },
  methods: {
    ...mapActions("accountCharge", ["reset", "saveCharge"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    getClientCode: debounce(function() {
      this.$axios
        .get(`/api/v1/client-code/?search=${this.query}`)
        .then((res) => {
          this.clientCodes = res.data.results;
          this.clientCodes.forEach((value) => {
            this.clientHourlyRate = value.hourly_rate;
          });
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
          console.log(this.clientUser);
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        const payload = {
          staff: this.staff.id,
          staff_hourly_rate: this.hourly_rate,
          client: this.query,
          client_hourly_rate: this.clientHourlyRate,
          shift_date: this.shift_date,
          job_request: this.job_request,
          ticket_number: this.ticket_number,
          total_items: this.total_items,
          total_time: this.total_time,
          job_request_description: this.job_description,
        };
        await this.saveCharge(payload);
        this.query = "";
        this.reset();
        this.$validator.reset();
        this.fetch();
      }
    },
    successMessage() {
      return "Successfully added a new Job Order. Management is on it's way to process this.";
    },
    errorMessage(error) {
      if (error.staff) {
        return "Staff: " + this.error.staff;
      } else if (error.staff_hourly_rate) {
        return "Staff hourly rate: " + this.error.staff_hourly_rate;
      } else if (error.clientHourlyRate) {
        return "Client hourly rate: " + this.error.clientHourlyRate;
      } else if (error.shift_date) {
        return "Shift date: " + this.error.shift_date;
      } else if (error.job_request) {
        return "Job Request: " + this.error.job_request;
      } else if (error.ticket_number) {
        return "Ticket number: " + this.error.ticket_number;
      } else if (error.total_items) {
        return "Total items: " + this.error.total_items;
      } else if (error.total_time) {
        return "Total time: " + this.error.total_time;
      } else if (error.job_description) {
        return "Job description: " + this.error.job_description;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      } else if (error.details) {
        return "error: " + this.error.details
      }
    },
  },
  computed: {
    shift_date: {
      get() {
        return this.$store.getters["accountCharge/shift_date"];
      },
      set(value) {
        this.setBasicStoreValue("shift_date", value);
      },
    },
    job_request: {
      get() {
        return this.$store.getters["accountCharge/job_request"];
      },
      set(value) {
        this.setBasicStoreValue("job_request", value);
      },
    },
    ticket_number: {
      get() {
        return this.$store.getters["accountCharge/ticket_number"];
      },
      set(value) {
        this.setBasicStoreValue("ticket_number", value);
      },
    },
    total_items: {
      get() {
        return this.$store.getters["accountCharge/total_items"];
      },
      set(value) {
        this.setBasicStoreValue("total_items", value);
      },
    },
    hourly_rate: {
      get() {
        return this.$store.getters["accountCharge/staff_hourly_rate"];
      },
      set(value) {
        this.setBasicStoreValue("staff_hourly_rate", value);
      },
    },
    total_time: {
      get() {
        return this.$store.getters["accountCharge/total_time"];
      },
      set(value) {
        this.setBasicStoreValue("total_time", value);
      },
    },
    job_description: {
      get() {
        return this.$store.getters["accountCharge/job_request_description"];
      },
      set(value) {
        this.setBasicStoreValue("job_request_description", value);
      },
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
