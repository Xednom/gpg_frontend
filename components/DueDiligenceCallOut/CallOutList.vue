<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <h4 slot="header" class="card-title">Due Diligence Call Out list</h4>
          <div>
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
                responsive
                :items="callOuts"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :busy="isBusy"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                stacked="sm"
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
                <template #cell(name)="row">
                  {{ row.value.first }} {{ row.value.last }}
                </template>

                <template #cell(dd_link)="row">
                  <a
                    :href="row.item.dd_link"
                    v-if="row.item.dd_link"
                    target="_blank"
                    >link</a
                  >
                </template>

                <template #cell(initial_due_diligence_status)="row">
                    <span v-if="row.item.initial_due_diligence_status">
                      <b-badge variant="success">{{
                        row.item.initial_due_diligence_status
                      }}</b-badge>
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(initial_dd_date_complete)="row">
                    <span v-if="row.item.initial_dd_date_complete">
                      {{ row.item.initial_dd_date_complete }}
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(call_out_status)="row">
                    <span v-if="row.item.call_out_status">
                      <b-badge variant="success">{{
                        row.item.call_out_status
                      }}</b-badge>
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(tax_data_status)="row">
                    <span v-if="row.item.tax_data_status">
                      <b-badge variant="success">{{
                        row.item.tax_data_status
                      }}</b-badge>
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(zoning_data_status)="row">
                    <span v-if="row.item.zoning_data_status">
                      <b-badge variant="success">{{
                        row.item.zoning_data_status
                      }}</b-badge>
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(utilities_data_status)="row">
                    <span v-if="row.item.utilities_data_status">
                      <b-badge variant="success">{{
                        row.item.utilities_data_status
                      }}</b-badge>
                    </span>
                    <span v-else>-</span>
                </template>

                <template #cell(actions)="row">
                  <b-button size="sm" @click="row.toggleDetails">
                    {{ row.detailsShowing ? "Hide" : "Show" }} details
                  </b-button>
                </template>

                <template #row-details="row">
                  <b-card>
                    <category :callOut="row.item"></category>
                  </b-card>
                </template>
              </b-table>

              <!-- Info modal -->
              <b-modal
                :id="infoModal.id"
                :title="infoModal.title"
                ok-only
                @hide="resetInfoModal"
              >
                <span class="mt-3">
                  <category :category="callOut"></category>
                </span>
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

import Category from "@/components/DueDiligenceCallOut/CallOutUpdate";

export default {
  name: "call-out-list",
  components: {
    Category,
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
      callOut: "dueDiligenceCallOut/callOut",
      pagination: "dueDiligenceCallOut/callOutsPagination",
      staff: "user/staff",
      user: "user/user",
      client: "user/clientUser",
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
      callOuts: [],
      fields: [
        { key: "ticket_number", sortable: true },
        { key: "client_code", sortable: true },
        { key: "dd_link", sortable: true },
        { key: "apn", sortable: true },
        { key: "county", sortable: true },
        { key: "state", sortable: true },
        { key: "initial_due_diligence_status", sortable: true },
        { key: "initial_dd_date_complete", sortable: true },
        { key: "call_out_status", sortable: true },
        { key: "tax_data_status", sortable: true },
        { key: "zoning_data_status", sortable: true },
        { key: "utilities_data_status", sortable: true },
        { key: "call_out_dd_date_complete", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      limit: 1000,
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
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClientUser", id).then(() => {});
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      try {
        await this.$store.dispatch("user/fetchStaff", id).then(() => {});
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMe() {
      try {
        await this.$store.dispatch("user/fetchUser").then(() => {
          if (
            this.$auth.user.designation_category == "new_client" ||
            this.$auth.user.designation_category == "current_client" ||
            this.$auth.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.$auth.user.id);
          } else {
            this.fetchStaff(this.$auth.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchCallOut(id) {
      await this.$store.dispatch("dueDiligenceCallOut/fetchCallOut", id);
    },
    // async fetchCallOuts() {
    //   this.isBusy = true;
    //   await this.$store
    //     .dispatch("dueDiligenceCallOut/fetchCallOuts", this.pagination)
    //     .then(() => {
    //       this.isBusy = false;
    //     });
    // },

    async fetchCallOuts() {
      this.isBusy = true;
      return await this.$axios
        .get(`/api/v1/call-out/`)
        .then((res) => {
          this.isBusy = false;
          this.callOuts = res.data.results;
          this.totalRows = this.callOuts.length;
        })
        .catch((e) => {
          this.isBusy = false;
          throw e;
        });
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
  },
  async mounted() {
    await this.fetchCallOuts();
    await this.fetchMe();
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
