<template>
  <div class="content">
    <div class="row mt-5">
      <div class="col-12">
        <card>
          <h5 slot="header" class="title">Seller list</h5>
          <table class="table responsive">
            <thead class="thead-light">
              <tr>
                <th scope="col">Date lead added</th>
                <th scope="col">Lead type</th>
                <th scope="col">Seller lead name</th>
                <th scope="col">Phone number</th>
                <th scope="col">Email</th>
                <th scope="col">Lead status</th>
                <th scope="col">Seller asking price</th>
                <th scope="col">Counter offer amount</th>
                <th scope="col">Lead assigned to</th>
                <th scope="col">Total minutes consumed</th>
                <th scope="col">notes</th>
                <th scope="col">
                  <div class="row">
                    <div class="col-xs-12">
                      <b-btn class="btn btn-success" @click="addRow">
                        Add Row
                      </b-btn>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in sellerLists" :key="index">
              <tr>
                <td>
                  <base-input label="Date lead added">
                    <el-date-picker
                      v-model="item.date_lead_added"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="Choose date"
                    >
                    </el-date-picker>
                  </base-input>
                </td>
                <td>
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadType"
                    placeholder="Lead type"
                    v-model="item.lead_type"
                  >
                    <el-option
                      v-for="option in leadTypeChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <base-input
                    label="Seller Lead name"
                    name="Seller Lead name"
                    placeholder="Seller lead name"
                    v-model="item.seller_lead_name"
                  >
                  </base-input>
                </td>
                <td>
                  <base-input
                    label="Phone number"
                    name="Phone number"
                    placeholder="Phone number"
                    v-model="item.phone_number"
                  >
                  </base-input>
                </td>
                <td>
                  <base-input
                    label="Email"
                    name="Email"
                    placeholder="Email"
                    v-model="item.email"
                  >
                  </base-input>
                </td>
                <td>
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadStatus"
                    placeholder="Lead status"
                    v-model="item.lead_status"
                  >
                    <el-option
                      v-for="option in leadStatusChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <base-input
                    label="Seller Asking Price"
                    name="Seller Asking Price"
                    placeholder="Seller Asking Price"
                    v-model="item.seller_asking_price"
                  >
                  </base-input>
                </td>
                <td>
                  <b-btn
                    class="btn btn-danger btn-sm"
                    @click="deleteRow($event, index)"
                  >
                    <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
                  </b-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </card>
      </div>
    </div>
    <!-- info modal -->
  </div>
</template>
  <script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { Modal } from "@/components";
import Fuse from "fuse.js";
import swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";
import SellerList from "@/mixins/SellerList.js";
import { DatePicker } from "element-ui";

export default {
  mixins: [SellerList],
  name: "SellerList",
  components: {
    Modal,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker,
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
    ...mapGetters({
      // sellerLists: "sellerList/sellerLists",
      sellerList: "sellerList/sellerList",
      pagination: "sellerList/sellerListsPagination",
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
    propertyFileCount() {
      if (this.sellerList) {
        return this.sellerList.length;
      }
    },
  },
  data() {
    return {
      searchQuery: "",
      searchedData: [],
      propertyDetailFile: {},
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
        { key: "deate_lead_added", sortable: true },
        { key: "lead_type", sortable: true },
        { key: "seller_lead_name", sortable: true },
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
      sellerLists: [],
      leadTypeChoices: {
        placeholder: "",
        status: [
          { value: "buyers", label: "Buyers" },
          { value: "sellers", label: "Sellers" },
        ],
      },
      leadStatusChoices: {
        placeholder: "",
        status: [
          { value: "interested", label: "Interested" },
          { value: "not_interested", label: "Not Interested" },
          { value: "dead_lead", label: "Dead lead" },
          { value: "do_not_call_list", label: "Do Not Call List" },
        ],
      },
      modelValidations: {},
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
      let endpoint = `/api/v1/seller-list/${id}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.propertyDetailFile = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    // fetchSellerList() {
    //   this.isBusy = true;
    //   let endpoint = `/api/v1/seller-list/?search=${this.propertyDetail.id}`;
    //   return this.$axios
    //     .get(endpoint)
    //     .then((res) => {
    //       this.isBusy = false;
    //       this.sellerList = res.data.results;
    //     })
    //     .catch((e) => {
    //       this.isBusy = false;
    //       console.error(e);
    //     });
    // },
    // async fetchSellerList() {
    //   console.warn(this.pagination);
    //   this.isBusy = true;
    //   await this.$store
    //     .dispatch("sellerList/fetchSellerLists", this.pagination)
    //     .then(() => {
    //       console.warn("Seller list: ", this.sellerLists);
    //       this.isBusy = false;
    //     });
    // },
    refresh() {
      this.fetchSellerList();
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
    addRow: function () {
      this.sellerLists.push({
        date_lead_added: "",
        lead_type: "",
      });
      console.log(this.sellerLists);
    },
    deleteRow(e, index) {
      this.sellerLists.splice(index, 1);
    },
  },
  mounted() {
    // this.fetchMe();
    // setTimeout(() => this.fetchSellerList(), 1000);
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
  