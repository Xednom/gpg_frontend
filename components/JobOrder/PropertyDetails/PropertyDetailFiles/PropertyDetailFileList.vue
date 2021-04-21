<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card card-body-classes="table-full-width">
          <div>
            <b-button variant="success" @click="modals.create = true"
              >Add Property Detail File</b-button
            >
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
                :items="propertyDetailFiles"
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
                <template #cell(apn)="row">
                  <nuxt-link
                    :to="'/job-order/property-detail/' + row.item.apn"
                    >{{ row.item.apn }}</nuxt-link
                  >
                </template>

                <template #cell(url)="row">
                  <a :href="row.item.url" target="_blank">link here</a>
                </template>

                <template #cell(actions)="row">
                  <b-button
                    size="sm"
                    @click="
                      {
                        fetchPropertyFile(row.item.id), (modals.info = true);
                      }
                    "
                    class="mr-1"
                  >
                    Info
                  </b-button>
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
              :total-rows="propertyFileCount"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </div>
        </card>
      </div>
    </div>
    <!-- info modal -->
    <modal
      :show.sync="modals.info"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <property-detail-file
        :file="propertyDetailFile"
        :fetch="refresh"
      ></property-detail-file>
    </modal>

    <modal
      :show.sync="modals.create"
      headerClasses="justify-content-center"
      class="white-content"
    >
      <property-detail-file-create
        :file="propertyDetail"
        :user="user"
        :fetch="refresh"
      ></property-detail-file-create>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import PropertyDetailFile from "~/components/JobOrder/PropertyDetails/PropertyDetailFiles/PropertyDetailFileDetail";
import PropertyDetailFileCreate from "~/components/JobOrder/PropertyDetails/PropertyDetailFiles/PropertyDetailFileCreate";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "paginated",
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    PropertyDetailFile,
    PropertyDetailFileCreate,
  },
  props: {
    propertyDetail: {
      Type: Object,
    },
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
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
    propertyFileCount() {
      if (this.propertyDetailFiles) {
        return this.propertyDetailFiles.length;
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      propertyDetailFile: {},
      user: {},
      propertyDetailFiles: [],
      fuseSearch: null,
      isBusy: false,
      error: {
        property_detail: "",
        details: "",
        url: "",
        description: "",
        non_field_errors: "",
      },
      fields: [
        { key: "details", sortable: true },
        { key: "url", sortable: true },
        { key: "description", sortable: true },
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
        create: false,
        comments: false,
        info: false,
      },
    };
  },
  methods: {
    // ...mapActions("propertyDetail", ["deletePropertyDetail"]),
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
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
    async fetchPropertyFile(id) {
      let endpoint = `/api/v1/property-detail-file/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.propertyDetailFile = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    fetchPropertyDetailFiles() {
      this.isBusy = true;
      let endpoint = `/api/v1/property-detail-file/?search=${this.propertyDetail.id}`;
      return this.$axios
        .get(endpoint)
        .then((res) => {
          this.isBusy = false;
          this.propertyDetailFiles = res.data.results;
        })
        .catch((e) => {
          this.isBusy = false;
          console.error(e);
        });
    },
    refresh() {
      this.fetchPropertyDetailFiles();
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.details
          ? "Details: " + error.details
          : error.url
          ? "URL: " + errors.url
          : errors.description
          ? "Description" + error.description
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
    this.fetchMe();
    setTimeout(() => this.fetchPropertyDetailFiles(), 1000);
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
