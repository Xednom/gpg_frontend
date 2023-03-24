<template>
    <div class="content">
      <div class="row mt-5">
        <div class="col-12">
          <card card-body-classes="table-full-width">
            <div>
              <!-- <b-button variant="success" @click="modals.create = true"
                >Add listing </b-button
              > -->
              <b-button variant="success" v-b-modal.listing-create>Add listing</b-button>
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
                  :items="listings"
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

                  <template #cell(listing_status)="row">
                    {{ row.item.listing_status__name }} 
                  </template>
  
                  <template #cell(actions)="row">
                    <b-button
                      v-b-modal.listing-update
                      @click="
                        {
                          fetchListing(row.item.id), (modals.info = true);
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
                :total-rows="listingCount"
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
        <listing-update :fetch="fetchlisting"></listing-update>
      </modal> -->
  
      <b-modal id="listing-update" size="lg" title="Update listing" hide-footer>
        <listing-update
          :fetch="fetchListings"
          :item="listing"
        >
        </listing-update>
      </b-modal>
  
      <b-modal id="listing-create" size="lg" title="Add listing file(s)" hide-footer>
        <listing-create
          :fetch="fetchListings"
          :property-detail="propertyDetail"
        >
        </listing-create>
      </b-modal>
    </div>
  </template>
  <script>
  import { Table, TableColumn, Select, Option, DatePicker } from "element-ui";
  import ListingCreate from "~/components/JobOrder/PropertyDetails/Listing/ListingCreate.vue";
  import ListingUpdate from "~/components/JobOrder/PropertyDetails/Listing/ListingUpdate.vue";
  import { Modal } from "@/components";
  import swal from "sweetalert2";
  import { mapGetters } from "vuex";
  
  import ListingMixin from "@/mixins/Listing.js";
  
  export default {
    name: "ListingList",
    mixins: [ListingMixin],
    components: {
      Modal,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      ListingCreate,
      ListingUpdate,
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
          { key: "date_completed", sortable: true },
          { key: "status_of_job", sortable: true },
          { key: "tagging", sortable: true },
          { key: "listing_sites", sortable: true },
          { key: "listing_status", sortable: true },
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
      ...mapGetters({ listing: "listing/listing" }),
      ...mapGetters({ listings: "listing/listings" }),
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
      listingCount() {
        if (this.listings) {
          return this.listings.length;
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
      async fetchListing(id) {
        this.$store.dispatch("listing/fetchListing", id).then(() => {
          // this.item = this.listing;
          console.warn("listing: ", this.listing)
        });
      },
      async fetchListings() {
        this.$store
          .dispatch("listing/fetchListings", this.propertyDetail.id)
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
      this.fetchListings();
      setTimeout(() => {
        this.listingFields();
      }, 500);
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
        