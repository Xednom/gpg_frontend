<template>
  <div class="container content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <h4 slot="header" class="card-title">Resolution List</h4>
          <div>
            <b-container fluid>
              <!-- <b-row> -->
              <b-col sm="12" md="4" class="my-1 pull-left">
                <nuxt-link to="/resolution/create"
                  ><b-button class="create-button" variant="success"
                    >Create Resolution</b-button
                  ></nuxt-link
                >
              </b-col>

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
                    class="page-number"
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- </b-row> -->

              <!-- Main table element -->
              <b-table
                :items="resolutions"
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
                @filtered="onFiltered"
              >
                <template #table-busy>
                  <div class="text-center text-default my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(date_submitted)="row">
                  <nuxt-link :to="'/resolution/' + row.item.id">{{
                    row.item.date_submitted
                  }}</nuxt-link>
                </template>

                <template #cell(assigned_to)="row"> 
                  <span v-if="row.item.assigned_to">
                    {{ row.item.assigned_to }}
                  </span>
                  <span v-else-if="!row.item.assigned_to">
                    -
                  </span>
                </template>
                <template #cell(status)="row">
                  <span v-if="row.item.status == 'pending'">
                    <b-badge variant="warning">Pending</b-badge>
                  </span>
                  <span v-if="row.item.status == 'in_progress'">
                    <b-badge variant="info">In progress</b-badge>
                  </span>
                  <span v-if="row.item.status == 'resolution_provided'">
                    <b-badge variant="success">Resolution provided</b-badge>
                  </span>
                  <span v-if="row.item.status == 'on_hold'">
                    <b-badge variant="secondary">On hold</b-badge>
                  </span>
                  <span v-if="row.item.status == 'closed'">
                    <b-badge variant="dark">Closed</b-badge>
                  </span>
                </template>
              </b-table>

              <!-- Info modal -->
              <b-modal
                :id="infoModal.id"
                :title="infoModal.title"
                ok-only
                @hide="resetInfoModal"
              >
                <span class="mt-3"> </span>
              </b-modal>

              <!-- Payment portal modal -->
              <b-modal
                :id="paymentModal.id"
                :title="paymentModal.title"
                ok-only
                @hide="resetPaymentModal"
              >
                <span class="mt-3"> </span>
              </b-modal>
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
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
    <!-- Classic Modal -->
    <modal
      :show.sync="modals.classic"
      headerClasses="justify-content-center"
      class="white-content"
    >
    </modal>

    <modal
      :show.sync="modals.info"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <!-- <job-order-info :job="jobOrder"></job-order-info> -->
    </modal>

    <modal
      fade
      id="job-order-comments"
      headerClasses="justify-content-center"
      :show.sync="modals.comments"
      hide-footer
    >
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters } from "vuex";

export default {
  name: "paginated",
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({
      resolutions: "resolution/resolutions",
      pagination: "resolution/resolutionsPagination",
    }),
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
    computedFields() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return this.fields.filter((field) => !field.requiresStaff);
      } else {
        return this.fields.filter((field) => !field.requiresClient);
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      currentJobOrder: {},
      fuseSearch: null,
      isBusy: false,
      fields: [
        { key: "date_submitted", sortable: true },
        { key: "assigned_to", label: "Staff", sortable: true },
        { key: "client_name", sortable: true },
        { key: "category", sortable: true },
        { key: "description", sortable: true },
        { key: "status", sortable: true },
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
      paymentModal: {
        id: "payment-modal",
        title: "",
        content: "",
      },
      modals: {
        classic: false,
        comments: false,
        info: false,
      },
    };
  },
  methods: {
    async fetchResolutions() {
      this.isBusy = true;
      try {
        await this.$store.dispatch(
          "resolution/fetchResolutions",
          this.pagination
        );
        this.isBusy = false;
        this.totalRows = this.resolutions.length;
      } catch (e) {
        this.isBusy = false;
        this.errorMessage("danger", e.response.data);
      }
    },

    info(item, index, button) {
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    payment(item, index, button) {
      this.$root.$emit("bv::show::modal", this.paymentModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    resetPaymentModal() {
      this.paymentModal.title = "";
      this.paymentModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    handleDelete(index, row) {
      swal({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.deleteRow(row);
          swal({
            title: "Deleted!",
            text: `You deleted ${row.name}`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false,
          });
        }
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.date_submitted
          ? "Date submitted: " + error.date_submitted
          : error.category
          ? "Category: " + error.category
          : error.description
          ? "Description: " + error.description
          : error.assigned_to
          ? "Assigned to: " + error.assigned_to
          : error.client
          ? "Client: " + error.client
          : error.resolution_provided_by_management
          ? "Resolution provided by management: " +
            error.resolution_provided_by_management
          : error.status
          ? "Status: " + error.status
          : error.additional_notes
          ? "Additional notes: " + error.additional_notes
          : error.detail
          ? "Detail: " + error.detail
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  async mounted() {
    await this.fetchResolutions();
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
.page-number {
  color: black !important;
  background-color: white !important;
}
</style>
