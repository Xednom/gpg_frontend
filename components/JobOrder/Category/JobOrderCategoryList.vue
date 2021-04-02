<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <h4 slot="header" class="card-title">
            Per APN Job Order
          </h4>
          <div>
            <b-container fluid>
              <!-- <b-row> -->
              <b-col sm="12" md="4" class="my-1 pull-left">
                <b-button variant="success" @click="modals.classic = true"
                  >Create Job order</b-button
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
                    v-model="perPage"
                    :options="pageOptions"
                    size="sm"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- </b-row> -->

              <!-- Main table element -->
              <b-table
                :items="jobOrderCategories"
                :fields="computedFields"
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
                <template #cell(ticket_number)="row">
                  <nuxt-link
                    :to="'/job-order/category/' + row.item.ticket_number"
                    >{{ row.item.ticket_number }}</nuxt-link
                  >
                </template>

                <template #cell(property_detail)="row">
                  <nuxt-link
                    :to="'/job-order/property-detail/' + row.item.property_detail"
                    target="_blank"
                    >{{ row.item.property_detail }}</nuxt-link
                  >
                </template>

                <template #row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
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
                <pre>{{ infoModal.content }}</pre>
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
    <!-- modal for create -->
    <modal
      :show.sync="modals.classic"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <job-order-create
        :fetch="fetchJobOrderCategories"
        :staff="staff"
        :client="client"
      ></job-order-create>
    </modal>

    <!-- modal for comment -->
    <modal
      fade
      id="job-order-comments"
      headerClasses="justify-content-center"
      :show.sync="modals.comments"
      hide-footer
    >
      <job-order-category-comment
        :fetch="fetchJobOrderCategories"
        :staff="staff"
        :client="client"
        :job="jobOrderCategory"
      ></job-order-category-comment>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import users from "../../../util/mock-users";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";

import jobOrderCreate from "@/components/JobOrder/Category/JobOrderCategoryCreate";
import jobOrderCategoryComment from "@/components/JobOrder/Category/JobOrderCategoryComment";

export default {
  name: "paginated",
  components: {
    jobOrderCreate,
    jobOrderCategoryComment,
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
      jobOrderCategories: "jobOrderCategory/jobOrderCategories",
      jobOrderCategory: "jobOrderCategory/jobOrderCategory",
      pagination: "jobOrderCategory/jobOrderCategoriesPagination",
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
      tableData: users,
      searchedData: [],
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
        { key: "ticket_number", sortable: true },
        { key: "property_detail", label: "APN", sortable: true},
        { key: "client_code", sortable: true, requiredStaff: true },
        { key: "category_", sortable: true },
        { key: "status", sortable: true },
        { key: "due_date", sortable: true },
        { key: "date_completed", sortable: true },
        { key: "url_of_the_completed_jo", sortable: true },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
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
        comments: false,
        info: false,
      },
    };
  },
  methods: {
    // ...mapActions("jobOrderCategoryCategory", ["deletejobOrderCategoryCategory"]),
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
      this.loading = true;
      try {
        await this.$store.dispatch("user/fetchClientUser", id).then(() => {
          this.loading = false;
        });
      } catch (err) {
        console.log(err.response.data);
      }
    },
    async fetchStaff(id) {
      this.loading = true;
      try {
        await this.$store.dispatch("user/fetchStaff", id).then(() => {
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        await this.$store.dispatch("user/fetchUser").then(() => {
          this.loading = false;
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
        console.log(err.response.data);
        this.loading = false;
      }
    },
    async fetchJobOrderCategory(id) {
      await this.$store.dispatch("jobOrderCategory/fetchJobOrderCategory", id);
    },
    async fetchJobOrderCategories() {
      this.isBusy = true;
      await this.$store
        .dispatch("jobOrderCategory/fetchJobOrderCategories", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
    async deletejobOrderCategory(id) {
      await this.$store.dispatch("jobOrderCategory/deleteJobOrderCategory", id);
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
    handleDelete(row) {
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
        console.log(row);
        if (result.value) {
          console.log(row);
          this.deletejobOrderCategory(row);
          let url = `/api/v1/job-order-by-category/${row}/`;
          try {
            this.$axios.delete(url);
            this.fetchJobOrderCategories();
          } catch (err) {
            console.error(err);
            this.error = err.response.data;
            this.errorMessage("danger", this.error);
          }
          swal({
            title: "Deleted!",
            text: `You deleted ${row}`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false,
          });
        }
      });
    },
  },
  async mounted() {
    await this.fetchJobOrderCategories();
    await this.fetchMe();
    this.totalRows = this.jobOrderCategories.length;
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
