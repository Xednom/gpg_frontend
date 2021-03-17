<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <form @submit.prevent="save">
          <div class="col-sm-12 col-md-12">
            <card>
              <h5 class="info-text">
                Property Details
              </h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-5">
                  <base-input
                    label="APN"
                    name="apn"
                    required
                    placeholder="APN"
                    v-model="propertyDetail.apn"
                    v-validate="modelValidations.apn"
                    :error="getError('apn')"
                    addon-left-icon="tim-icons icon-single-02"
                  >
                  </base-input>

                  <base-input
                    label="County"
                    name="county"
                    required
                    placeholder="County"
                    v-model="propertyDetail.county"
                    v-validate="modelValidations.county"
                    :error="getError('county')"
                    addon-left-icon="tim-icons icon-email-85"
                  >
                  </base-input>
                </div>
                <div class="col-sm-5">
                  <base-input
                    label="State"
                    name="state"
                    required
                    placeholder="State"
                    v-model="propertyDetail.state"
                    v-validate="modelValidations.state"
                    :error="getError('state')"
                    addon-left-icon="tim-icons icon-caps-small"
                  >
                  </base-input>

                  <base-input
                    label="Size"
                    name="size"
                    required
                    placeholder="Size(Acreage)"
                    v-model="propertyDetail.size"
                    v-validate="modelValidations.size"
                    :error="getError('size')"
                    addon-left-icon="tim-icons icon-mobile"
                  >
                  </base-input>
                </div>
                <div class="col-sm-10">
                  <div class="row">
                    <label>Property Status </label>
                  </div>
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="propertyStatus"
                    placeholder="Property Status"
                    v-model="propertyDetail.property_status"
                    v-validate="modelValidations.propertyStatus"
                    :error="getError('propertyStatus')"
                  >
                    <el-option
                      v-for="option in propertyStatusChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </card>

            <card>
              <h5 class="info-text">
                Property Price
              </h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-5">
                  <label>Asking Price</label>
                  <textarea
                    class="form-control"
                    type="text"
                    placeholder="Asking price"
                    v-model="propertyDetail.asking_price"
                    v-validate="'required'"
                    :error="getError('asking_price')"
                    required
                  >
                  </textarea>
                </div>
                <div class="col-sm-5">
                  <label>Cash terms</label>
                  <textarea
                    class="form-control"
                    type="text"
                    placeholder="Cash terms"
                    v-model="propertyDetail.cash_terms"
                    v-validate="'required'"
                    :error="getError('cash_terms')"
                    required
                  >
                  </textarea>
                </div>
                <div class="col-sm-5 mt-3">
                  <label>Finance terms</label>
                  <textarea
                    name="finance_terms"
                    class="form-control"
                    type="text"
                    placeholder="Finance terms"
                    v-model="propertyDetail.finance_terms"
                    v-validate="'required'"
                    :error="getError('finance_terms')"
                    required
                  >
                  </textarea>
                </div>
                <div class="col-sm-5 mt-3">
                  <label>Other terms</label>
                  <textarea
                    name="other_terms"
                    class="form-control"
                    type="text"
                    placeholder="Other terms"
                    v-model="propertyDetail.other_terms"
                    v-validate="'required'"
                    :error="getError('other_terms')"
                    required
                  >
                  </textarea>
                </div>
                <div class="col-sm-10 status mt-3">
                  <div class="row">
                    <label>Price Status</label>
                  </div>
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="price_status"
                    placeholder="Price Status"
                    v-model="propertyDetail.price_status"
                    v-validate="modelValidations.priceStatus"
                    :error="getError('price_status')"
                  >
                    <el-option
                      v-for="option in priceStatusChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="col-sm-10 mt-3">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    class="form-control"
                    type="text"
                    placeholder="Notes"
                    v-model="propertyDetail.notes"
                    v-validate="'required'"
                    :error="getError('notes')"
                    required
                  >
                  </textarea>
                </div>
              </div>
            </card>

            <card>
              <h5 class="info-text">
                Listing Ad Details
              </h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-10 category-choices">
                  <div class="row">
                    <label>Categroy</label>
                  </div>
                  <el-select
                    class="select-primary"
                    size="large"
                    placeholder="Category"
                    v-model="propertyDetail.category"
                  >
                    <el-option
                      v-for="option in categoryChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="col-sm-10 mt-3">
                  <label>Ad Details</label>
                  <textarea
                    name="ad_details"
                    class="form-control"
                    placeholder="Ad details"
                    v-model="propertyDetail.ad_details"
                  >
                  </textarea>
                </div>
                <div class="col-sm-10 mt-3">
                  <label>Notes</label>
                  <textarea
                    name="notes_client_side"
                    class="form-control"
                    placeholder="Notes from the Client"
                    v-model="propertyDetail.notes_client_side"
                  >
                  </textarea>

                  <textarea
                    v-if="this.$auth.user.designation_category == 'staff'"
                    name="notes_va_side"
                    class="form-control"
                    placeholder="Notes from VA"
                    v-model="propertyDetail.notes_va_side"
                  >
                  </textarea>

                  <textarea
                    v-if="this.$auth.user.designation_category == 'staff'"
                    name="notes_management_side"
                    class="form-control"
                    placeholder="Notes - Management side"
                    v-model="propertyDetail.notes_management_side"
                  >
                  </textarea>
                </div>
              </div>
            </card>
          </div>
          <div class="pull-right">
            <base-button
              native-type="submit"
              type="success"
              class="animation-on-hover"
              >Save</base-button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import { Select, Option } from "element-ui";

import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";

export default {
  name: "wizard-form",
  mixins: ["CreatePropertyDetailMixin"],
  data() {
    return {
      wizardModel: {},
      loading: false,
      clientUser: {},
      staffUser: {},
      propertyDetail: {},
      propertyStatusChoices: {
        placeholder: "",
        status: [
          { value: "sold", label: "Sold" },
          { value: "available", label: "Available" },
          { value: "in_escrow", label: "In Escrow" },
          { value: "in_contract", label: "In Contract" },
          { value: "ready_to_purchase", label: "Ready to Purchase" },
          { value: "canceled_transaction", label: "Canceled Transaction" },
        ],
      },
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "change", label: "Change" },
          { value: "active", label: "Active" },
        ],
      },
      categoryChoices: {
        placeholder: "",
        status: [
          { value: "company_name", label: "Company name" },
          { value: "phone", label: "Phone" },
          { value: "email_ad", label: "Email Ad" },
          { value: "website_url", label: "Website url" },
        ],
      },
      modelValidations: {
        askingPrice: {
          required: true,
        },
        cashTerms: {
          required: true,
        },
        financeTerms: {
          required: true,
        },
        otherTerms: {
          required: true,
        },
        notes: {
          required: true,
        },
        priceStatus: {
          required: true,
        },
        askingPrice: {
          required: true,
        },
        cashTerms: {
          required: true,
        },
        financeTerms: {
          required: true,
        },
        otherTerms: {
          required: true,
        },
        notes: {
          required: true,
        },
        priceStatus: {
          required: true,
        },
      },
    };
  },
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["updatePropertyDetail", "reset"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    async fetchPropertyDetail(payload) {
      let endpoint = `/api/v1/property-detail/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.propertyDetail = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      this.loading = true;
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          this.loading = false;
          console.log(this.user);
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.log(err.response.data);
        this.loading = false;
      }
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        const clientPayload = {
          ticket_number: this.propertyDetail.ticket_number,
          client: this.clientUser.id,
          price_status: this.propertyDetail.price_status,
          property_status: this.propertyDetail.property_status,
          category: this.propertyDetail.category,
          apn: this.propertyDetail.apn,
          county: this.propertyDetail.county,
          state: this.propertyDetail.state,
          size: this.propertyDetail.size,
          asking_price: this.propertyDetail.asking_price,
          cash_terms: this.propertyDetail.cash_terms,
          finance_terms: this.propertyDetail.finance_terms,
          other_terms: this.propertyDetail.other_terms,
          notes: this.propertyDetail.notes,
          ad_details: this.propertyDetail.ad_details,
          notes_client_side: this.propertyDetail.notes_client_side,
          notes_va_side: this.propertyDetail.notes_va_side,
          notes_management_side: this.propertyDetail.notes_management_side,
        };

        const staffPayload = {
          ticket_number: this.propertyDetail.ticket_number,
          staff: this.staffUser.id,
          price_status: this.propertyDetail.price_status,
          property_status: this.propertyDetail.property_status,
          category: this.propertyDetail.category,
          apn: this.propertyDetail.apn,
          county: this.propertyDetail.county,
          state: this.propertyDetail.state,
          size: this.propertyDetail.size,
          asking_price: this.propertyDetail.asking_price,
          cash_terms: this.propertyDetail.cash_terms,
          finance_terms: this.propertyDetail.finance_terms,
          other_terms: this.propertyDetail.other_terms,
          notes: this.propertyDetail.notes,
          ad_details: this.propertyDetail.ad_details,
          notes_client_side: this.propertyDetail.notes_client_side,
          notes_va_side: this.propertyDetail.notes_va_side,
          notes_management_side: this.propertyDetail.notes_management_side,
        };

        if (this.$auth.user.designation_category == "staff") {
          await this.updatePropertyDetail(staffPayload).then(() => {
            this.$router.push("/job-order/property-detail");
          });
        } else {
          await this.updatePropertyDetail(clientPayload).then(() => {
            this.$router.push("/job-order/property-detail");
          });
        }
        this.loading = false;
        this.reset();
      }
    },
  },
  mounted() {
    this.fetchMe();
    this.fetchPropertyDetail(this.$route.params.ticket_number);
  },
};
</script>
