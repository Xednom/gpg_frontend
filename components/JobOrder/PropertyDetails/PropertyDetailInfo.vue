<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <card>
              <h5 class="info-text"><b-skeleton width="25%"></b-skeleton></h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </card>
            <card>
              <h4 class="card-title">
                <b-skeleton width="25%"></b-skeleton>
              </h4>
              <div class="property-price-list">
                <b-skeleton width="85%"></b-skeleton>
              </div>
            </card>

            <card>
              <h5 class="info-text">
                <b-skeleton width="25%"></b-skeleton>
              </h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-10">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </card>
          </template>

          <form @submit.prevent="save">
            <base-alert v-if="success" type="success" dismissible>
              <span>
                {{ successMessage() }}
              </span>
            </base-alert>
            <div class="col-sm-12 col-md-12">
              <card>
                <template slot="header">
                  <h3 class="card-title">APN Inventory</h3>
                </template>
                <tabs
                  type="primary"
                  tabNavWrapperClasses="col-lg-3 col-md-6"
                  tabContentClasses="col-md-8"
                  vertical
                  square
                  class="row"
                >
                  <tab-pane>
                    <span slot="label">
                      <i class="tim-icons"></i>Property Details
                    </span>
                    <h5 class="info-text">Property Details</h5>
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
                        >
                        </base-input>

                        <div class="row">
                          <label>County</label>
                        </div>
                        <el-select
                          class="select-primary"
                          size="large"
                          placeholder="Select a County"
                          v-model="propertyDetail.county"
                          filterable
                        >
                          <template v-if="!this.propertyDetail.state"
                            >Please select a State first</template
                          >
                          <template v-else>
                            <el-option
                              v-for="option in counties"
                              class="select-primary"
                              :value="option.name"
                              :label="option.label"
                              :key="option.label"
                            >
                            </el-option>
                          </template>
                        </el-select>
                      </div>
                      <div class="col-sm-5">
                        <div class="row">
                          <label>State</label>
                        </div>
                        <el-select
                          class="select-primary"
                          size="large"
                          placeholder="Select a State"
                          v-model="propertyDetail.state"
                          @change="changeFetchCounties"
                          filterable
                        >
                          <el-option
                            v-for="option in states"
                            class="select-primary"
                            :value="option.name"
                            :label="option.label"
                            :key="option.label"
                          >
                          </el-option>
                        </el-select>

                        <base-input
                          label="Size"
                          name="size"
                          required
                          placeholder="Size(Acreage)"
                          v-model="propertyDetail.size"
                          v-validate="modelValidations.size"
                          :error="getError('size')"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5">
                        <base-input
                          label="Client code"
                          name="client_code"
                          required
                          placeholder="Client code"
                          v-model="propertyDetail.client"
                          v-validate="modelValidations.client_code"
                          :error="getError('client_code')"
                          disabled
                        >
                        </base-input>
                        <base-input
                          label="Property owner"
                          name="property owner"
                          required
                          placeholder="Property owner"
                          v-model="propertyDetail.property_owner"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5">
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
                  </tab-pane>

                  <tab-pane>
                    <span slot="label">
                      List of Property Prices for APN
                      <strong>{{ propertyDetail.apn }}</strong>
                    </span>
                    <property-price-list
                      :propertyDetail="this.propertyDetail"
                    ></property-price-list>
                  </tab-pane>
                  <tab-pane>
                    <span slot="label">
                      List of Property files for APN
                      <strong>{{ propertyDetail.apn }}</strong>
                    </span>
                    <property-file-list
                      :propertyDetail="this.propertyDetail"
                    ></property-file-list>
                  </tab-pane>
                  <tab-pane>
                    <span slot="label">
                      Listing Ad Details
                    </span>
                    <h5 class="info-text">
                      Listing Ad Details
                    </h5>
                    <div class="row justify-content-center mt-5">
                      <div class="col-sm-5">
                        <base-input
                          label="Company name"
                          v-model="propertyDetail.company_name"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5">
                        <base-input
                          label="Phone"
                          v-model="propertyDetail.phone"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5">
                        <base-input
                          label="Email"
                          v-model="propertyDetail.email"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5 category-choices">
                        <base-input
                          label="Website url"
                          v-model="propertyDetail.website_url"
                        >
                        </base-input>
                      </div>
                      <div class="col-sm-5 mt-3">
                        <a
                          href="https://form.jotform.com/210818766251458"
                          target="_blank"
                          >Logo(Please attached file)</a
                        >
                      </div>
                      <div class="col-sm-5">
                        <base-input
                          label="Logo(If you're using file storage such as Gdrive, Dropbox, etc..)"
                          v-model="propertyDetail.file_storage"
                        >
                        </base-input>
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
                  </tab-pane>
                </tabs>
              </card>
            </div>
            <div class="pull-right">
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
          </form>
        </b-skeleton-wrapper>
      </div>
    </div>
    <modal
      :show.sync="modals.create"
      headerClasses="justify-content-center"
      class="white-content"
    >
    </modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import { Modal } from "@/components";
import { Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import PropertyPriceList from "~/components/JobOrder/PropertyDetails/PropertyPriceList";
import PropertyFileList from "~/components/JobOrder/PropertyDetails/PropertyDetailFiles/PropertyDetailFileList";
import PropertyPriceCreate from "~/components/JobOrder/PropertyDetails/PropertyPriceCreate";
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";

import { TabPane, Tabs, Collapse, CollapseItem } from "@/components";

export default {
  name: "wizard-form",
  mixins: ["CreatePropertyDetailMixin"],
  data() {
    return {
      property_price_statuses: [],
      property_detail_files: [],
      user: {},
      wizardModel: {},
      loading: false,
      saving: false,
      success: false,
      clientUser: {},
      staffUser: {},
      propertyDetail: {},
      states: [],
      counties: [],
      modals: {
        create: false,
      },
      error: {
        client: "",
        staff: "",
        apn: "",
        state: "",
        county: "",
        size: "",
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        notes: "",
        non_field_errors: "",
      },
      propertyStatusChoices: {
        placeholder: "",
        status: [
          { value: "sold", label: "Sold" },
          { value: "available", label: "Available" },
          { value: "in_escrow", label: "In Escrow" },
          { value: "in_contract", label: "In Contract" },
          { value: "ready_to_purchase", label: "Ready to Purchase" },
          { value: "canceled_transaction", label: "Canceled Transaction" },
          { value: "interested_to_purchase", label: "Interested to purchase" },
          { value: "need_of_research", label: "In need of research" },
          { value: "not_applicable", label: "Not applicable" },
        ],
      },
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "deactivate", label: "Deactivate" },
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
    PropertyPriceList,
    PropertyFileList,
    Modal,
    PropertyPriceCreate,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
    BaseAlert,
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["updatePropertyDetail", "reset"]),
    fetchPropertyPrices() {
      let endpoint = `/api/v1/property-price/?search=${this.propertyDetail}`;
      return this.$axios
        .get(endpoint)
        .then((res) => {
          this.propertyPrices = res.data.results;
        })
        .catch((e) => {
          throw e;
        });
    },
    refresh() {
      this.fetchPropertyPrices();
    },
    async fetchCounties(state) {
      let endpoint = `/api/v1/county/?search=${state}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.counties = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
    async changeFetchCounties(state) {
      let endpoint = `/api/v1/county/?search=${state}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.counties = res.data;
          this.reset();
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchStates() {
      let endpoint = `/api/v1/state/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.states = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
    reset() {
      this.propertyDetail.county = null;
    },
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
      this.loading = true;
      let endpoint = `/api/v1/property-detail/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.loading = false;
          this.propertyDetail = res.data;
        })
        .catch((e) => {
          this.loading = false;
          console.error(e);
          throw e;
        });
    },
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
    async fetchStaff(id) {
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
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
        console.error(err.response.data);
        this.loading = false;
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        this.error.apn
          ? "APN: " + this.error.apn
          : this.error.state
          ? "State: " + this.error.state
          : this.error.county
          ? "County: " + this.error.county
          : this.error.size
          ? "Size: " + this.error.username
          : this.error.property_status
          ? "Property status: " + this.error.property_status
          : this.error.asking_price
          ? "Asking price: " + this.error.asking_price
          : this.error.finance_terms
          ? "Finance terms: " + this.error.finance_terms
          : this.error.cash_terms
          ? "Cash terms: " + this.error.cash_terms
          : this.error.other_terms
          ? "Other terms: " + this.error.other_terms
          : this.error.notes
          ? "Notes: " + this.error.notes
          : this.error.non_field_errors
          ? this.error.non_field_errors
          : this.error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
    successMessage() {
      return "Successfully updated your APN informations!";
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.saving = true;
        this.propertyDetail.property_price_statuses.forEach((item) => {
          item.user = this.$auth.user.id;
          item.updated_info =
            "Updated by " +
            this.$auth.user.first_name +
            " " +
            this.$auth.user.last_name +
            ". Status was changed to " +
            item.price_status +
            ", date updated: " +
            new Date().toLocaleString();
        });

        const clientPayload = {
          ticket_number: this.propertyDetail.ticket_number,
          client: this.clientUser.client_code,
          price_status: this.propertyDetail.price_status,
          property_status: this.propertyDetail.property_status,
          category: this.propertyDetail.category,
          apn: this.propertyDetail.apn,
          county: this.propertyDetail.county,
          state: this.propertyDetail.state,
          size: this.propertyDetail.size,
          property_owner: this.propertyDetail.property_owner,
          notes_client_side: this.propertyDetail.notes_client_side,
          notes_va_side: this.propertyDetail.notes_va_side,
          notes_management_side: this.propertyDetail.notes_management_side,
          company_name: this.propertyDetail.company_name,
          phone: this.propertyDetail.phone,
          email: this.propertyDetail.email,
          website_url: this.propertyDetail.website_url,
          file_storage: this.propertyDetail.file_storage,
          property_price_statuses: this.propertyDetail.property_price_statuses,
        };

        const staffPayload = {
          ticket_number: this.propertyDetail.ticket_number,
          staff: [this.staffUser.id],
          client: this.propertyDetail.client,
          staff_email: this.$auth.user.email,
          price_status: this.propertyDetail.price_status,
          property_status: this.propertyDetail.property_status,
          category: this.propertyDetail.category,
          apn: this.propertyDetail.apn,
          county: this.propertyDetail.county,
          state: this.propertyDetail.state,
          size: this.propertyDetail.size,
          property_owner: this.propertyDetail.property_owner,
          notes_client_side: this.propertyDetail.notes_client_side,
          notes_va_side: this.propertyDetail.notes_va_side,
          notes_management_side: this.propertyDetail.notes_management_side,
          company_name: this.propertyDetail.company_name,
          phone: this.propertyDetail.phone,
          email: this.propertyDetail.email,
          website_url: this.propertyDetail.website_url,
          file_storage: this.propertyDetail.file_storage,
          property_price_statuses: this.propertyDetail.property_price_statuses,
        };

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.updatePropertyDetail(staffPayload)
              .then(() => {
                this.saving = false;
                this.success = true;
                this.successMessage();
              })
              .catch((e) => {
                this.saving = false;
                this.error = e.response.data;
                this.errorMessage("danger", this.error);
              });
          } catch (e) {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          }
          setTimeout(() => (this.success = false), 2000);
        } else {
          try {
            this.saving = true;
            await this.updatePropertyDetail(clientPayload)
              .then(() => {
                this.saving = false;
                this.success = true;
                this.successMessage();
              })
              .catch((e) => {
                this.saving = false;
                this.error = e.response.data;
                this.errorMessage("danger", this.error);
              });
          } catch (e) {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          }
          setTimeout(() => (this.success = false), 2000);
        }
        this.saving = false;
      }
    },
  },
  mounted() {
    this.fetchMe();
    this.fetchPropertyDetail(this.$route.params.ticket_number);
    this.fetchStates();
    setTimeout(() => this.fetchCounties(this.propertyDetail.state), 1000);
  },
};
</script>

<style scoped>
.property-add {
  float: right !important;
}
</style>
