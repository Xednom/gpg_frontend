<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <!-- <b-button variant="success" @click="modals.create = true"
              >Add Acquisition </b-button
            > -->
            <b-button v-b-modal.create>Add Acquisition</b-button>
            <b-container fluid>
              <!-- <b-row> -->
              <b-col sm="12" md="4" lg="4" class="my-1 pull-right">
                <b-form-group
                  label="Filter"
                  label-for="filter-input"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-input"
                      v-model="filter"
                      type="search"
                      placeholder="Type to Search"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''"
                        >Clear</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>

                <b-form-group
                  label="Per page"
                  label-for="per-page-select"
                  label-cols-sm="6"
                  label-cols-md="4"
                  label-cols-lg="3"
                  label-align-sm="right"
                  label-size="sm"
                  class="mb-0"
                >
                  <b-form-select
                    id="per-page-select"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- </b-row> -->

              <!-- Main table element -->
              <b-table
                :items="acquisitions"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                stacked="md"
                show-empty
                small
                responsive
                @filtered="onFiltered"
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(apn)="row">
                  <nuxt-link
                    :to="'/job-order/property-detail/' + row.item.apn"
                    >{{ row.item.apn }}</nuxt-link
                  >
                </template>

                <template #cell(actions)="row">
                  <b-button
                    v-b-modal.update
                    @click="
                      {
                        fetchAcquisition(row.item.id), (modals.info = true);
                      }
                    "
                    >Info</b-button
                  >
                </template>
              </b-table>
            </b-container>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category"></p>
            </div>
            <b-pagination
              v-model="currentPage"
              :total-rows="acquisitionCount"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
    <!-- update modal -->
    <!-- <modal
      :show.sync="modals.info"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <acquisition-update :fetch="fetchAcquisition"></acquisition-update>
    </modal> -->

    <b-modal id="update" size="lg" title="Update Acquisition" hide-footer>
      <acquisition-update
        :fetch="fetchAcquisitions"
      >
      </acquisition-update>
    </b-modal>

    <b-modal id="create" size="lg" title="Add Acquisition" hide-footer>
      <acquisition-create
        :fetch="fetchAcquisitions"
        :property-detail="propertyDetail"
      >
        <template #modal-footer>
          <div class="w-100">
            <p class="float-left">Modal Footer Content</p>
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              @click="show = false"
            >
              Close
            </b-button>
          </div>
        </template>
      </acquisition-create>
    </b-modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option, DatePicker } from "element-ui";
import PropertyPriceDetail from "~/components/JobOrder/PropertyDetails/PropertyPriceUpdate";
import PropertyPriceCreate from "~/components/JobOrder/PropertyDetails/PropertyPriceCreate";
import AcquisitionCreate from "~/components/JobOrder/PropertyDetails/Acquisition/AcquisitionCreate.vue";
import AcquisitionUpdate from "~/components/JobOrder/PropertyDetails/Acquisition/AcquisitionUpdate.vue";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters } from "vuex";

import AcquisitionMixin from "@/mixins/Acquisition.js";

export default {
  name: "AcquisitionList",
  mixins: [AcquisitionMixin],
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    PropertyPriceDetail,
    PropertyPriceCreate,
    AcquisitionCreate,
    AcquisitionUpdate,
    [DatePicker.name]: DatePicker,
  },
  props: {
    propertyDetail: {
      Type: Object,
    },
    fetch: {
      Type: Function,
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      propertyPrice: {},
      user: {},
      fuseSearch: null,
      isBusy: false,
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
      fields: [
        { key: "client_code", sortable: true },
        { key: "possible_offer", sortable: true },
        { key: "approved_amount_from_client", sortable: true },
        { key: "minimum_amount", sortable: true },
        { key: "maximum_amount", sortable: true },
        { key: "amount_closed_deal", sortable: true },
        { key: "deal_status", sortable: true },
        { key: "assigned_sales_team", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 100,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      modals: {
        classic: false,
        create: false,
        comments: false,
        info: false,
      },
    };
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({ acquisition: "acquisition/acquisition" }),
    ...mapGetters({ acquisitions: "acquisition/acquisitions" }),
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    acquisitionCount() {
      if (this.acquisitions) {
        return this.acquisitions.length;
      }
    },
  },

  methods: {
    handleLike(index, row) {
      swal({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill",
      });
    },
    handleEdit(index, row) {
      swal({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill",
      });
    },
    async deletePropertyDetail(id) {
      await this.$store.dispatch("propertyDetail/deletePropertyDetail", id);
    },

    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetchAcquisition(id) {
      this.$store.dispatch("acquisition/fetchAcquisition", id).then(() => {
        this.item = this.acquisition;
      });
    },
    async fetchAcquisitions() {
      this.$store
        .dispatch("acquisition/fetchAcquisitions", this.propertyDetail.id)
        .then(() => {});
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.apn
          ? "APN: " + error.apn
          : error.state
          ? "State: " + errors.state
          : errors.county
          ? "County" + error.county
          : error.size
          ? "Size: " + error.username
          : error.property_status
          ? "Property status: " + error.property_status
          : error.asking_price
          ? "Asking price: " + error.asking_price
          : error.finance_terms
          ? "Finance terms: " + error.finance_terms
          : error.cash_terms
          ? "Cash terms: " + error.cash_terms
          : error.other_terms
          ? "Other terms: " + error.other_terms
          : error.notes
          ? "Notes: " + error.notes
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Something went wrong`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  mounted() {
    this.fetchAcquisitions();
  },
};
</script>


<style scoped>
.pagination-select,
.search-input {
  width: 200px;
}
#job-order-comments .modal-dialog {
  transform: none !important;
}
</style>
      