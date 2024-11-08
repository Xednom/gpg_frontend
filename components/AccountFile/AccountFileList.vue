<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <h4 slot="header" class="card-title">Account files</h4>
          <div>
            <b-container fluid>
              <!-- <b-row> -->
              <b-col sm="12" md="4" class="my-1 pull-left" v-if="$auth.user.designation_category != 'staff'">
                <b-button variant="success" @click="modals.create = true"
                  >Add Account file</b-button
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
                :items="accountFiles"
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
                <template #cell(client_code)="row">
                  <template v-if="$auth.user.designation_category == 'staff'">
                    {{ row.item.client_code }}
                  </template>
                  <template v-else>
                    <nuxt-link
                    :to="'/account-files/' + row.item.id"
                    >{{ row.item.client_code }}</nuxt-link
                  >
                  </template>
                </template>

                <template #cell(url)="row">
                  <a :href="row.item.url" target="_blank">link here</a>
                </template>

                <template #cell(actions)="row">
                  <b-button
                    size="sm"
                    @click="
                      {
                        fetchAccountFile(row.item.id), (modals.info = true);
                      }
                    "
                    class="mr-1"
                  >
                  Info
                  </b-button>
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

              <!-- Classic Modal -->
              <modal
                :show.sync="modals.create"
                headerClasses="justify-content-center"
                class="white-content"
              >
                <file-create :fetch="fetchAccountFiles"></file-create>
              </modal>

              <!-- Info modal -->
              <modal
                :show.sync="modals.info"
                headerClasses="justify-content-center"
                class="white-content"
              >
                <file-view :file="this.accountFile"></file-view>
              </modal>
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
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import FileCreate from "@/components/AccountFile/AccountFileCreate";
import FileView from "@/components/AccountFile/AccountFileView";
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
    FileCreate,
    FileView
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapGetters({
      accountFiles: "accountFile/accountFiles",
      accountFile: "accountFile/accountFile",
      pagination: "accountFile/accountFilesPagination",
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
      fuseSearch: null,
      isBusy: false,
      error: {
        client: "",
        staff: "",
        category: "",
        url: "",
        username: "",
        password: "",
        notes: "",
      },
      fields: [
        { key: "client_code", sortable: true, requiredStaff: true },
        { key: "file_name", sortable: true },
        { key: "url", sortable: true },
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
        create: false,
        info: false,
      },
    };
  },
  methods: {
    // ...mapActions("propertyDetail", ["deletePropertyDetail"]),
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
    async fetchAccountFile(id) {
      await this.$store.dispatch("accountFile/fetchAccountFile", id);
    },
    async fetchAccountFiles() {
      this.isBusy = true;
      await this.$store
        .dispatch("accountFile/fetchAccountFiles", this.pagination)
        .then(() => {
          this.isBusy = false;
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
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.category
          ? "Category: " + errors.category
          : errors.url
          ? "Url" + error.url
          : error.username
          ? "Username: " + error.username
          : error.password
          ? "Password: " + error.password
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
        if (result.value) {
          this.deletePropertyDetail(row);
          let url = `/api/v1/property-detail/${row}/`;
          try {
            this.$axios.delete(url);
            this.fetchPropertyDetails();
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
    await this.fetchAccountFiles();
    await this.fetchMe();
    this.totalRows = this.accountFiles.length;
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
