<template>
  <div class="hello">
    <div class="row bg-light text-dark">
      <div class="col-sm-4">
        <form @submit.prevent>
          <div class="form-group">
            <label for="linkName">Link Name</label>
            <input class="form-control" placeholder="Name of link" id="linkName" v-model="linkName" />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input
              class="form-control"
              placeholder="Description of Link"
              id="description"
              v-model="description"
            />
          </div>
          <div class="form-group">
            <label for="notes">Notes</label>
            <input
              class="form-control"
              placeholder="Notes"
              id="notes"
              v-model="notes"
              :class="{ error : lownotes }"
              @change="validate"
            />
          </div>
          <div class="form-group">
            <label for="url">Link URL</label>
            <input
              class="form-control"
              step="0.01"
              placeholder="Link URL"
              id="url"
              v-model="url"
              @change="validate"
            />
          </div>
          <div class="form-group">
            <label for="topicID">Topic *</label>
            <select class="form-control" id="topicID" v-model="topicID">
              <option v-for="(option,index) in topic" :value="option.id" :key="index">{{ option.topicName }}</option>
            </select>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="addProduct">Add</button>
            <button class="btn btn-primary" v-on:click="updateProduct">Update</button>
            <button class="btn btn-secondary" v-on:click="resetProduct">Reset</button>
          </div>
        </form>
      </div>
      <div class="row bg-light text-dark col-sm-8">
        <div class="bg-secondary">
          <div class="row-table">
            <table class="table table-dark table-hover bg-secondary">
              <thead>
                <tr>
                  <th class="sort" v-on:click="sortClick('category')">
                    Category
                    <i :class="sortIconCategory"></i>
                  </th>
                  <th class="sort" v-on:click="sortClick('linkName')">
                    Name
                    <i :class="sortIconlinkName"></i>
                  </th>
                  <th class="sort" v-on:click="sortClick('description')">
                    Description
                    <i :class="sortIconDescription"></i>
                  </th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th>
                    <select class="form-control" v-model="search.category">
                      <option value disabled selected>Category</option>
                      <option
                        v-for="(option,index) in topic"
                        :value="option.id"
                        :key="index"
                      >{{option.topicName}}</option>
                    </select>
                  </th>
                  <th>
                    <input class="form-control" placeholder="Name" v-model="search.linkName" />
                  </th>
                  <th>
                    <input
                      class="form-control"
                      placeholder="Description"
                      v-model="search.description"
                    />
                  </th>
                  <th>
                    <button class="btn btn-primary" v-on:click="productSearch">Find</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row,index) in products"
                  v-on:click="clickProduct(row)"
                  :key="index"
                  :class="{selected: row.selected }"
                >
                  <td v-if="topic[row.topicID]">{{topic[row.topicID-1]["topicName"]}}</td>
                  <td>{{row.linkName}}</td>
                  <td>{{row.description}}</td>
                  <td class="center-column">
                    <a href="javascript:;" v-on:click="deleteProduct($event, row)">
                      <i class="fas fa-minus-circle"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  /* eslint-disable */
  name: "HelloWorld",
  data() {
    return {
      isNew: true,
      isValid: true,
      id: null,
      linkName: null,
      description: null,
      notes: null,
      url: null,
      topicID: null,
      topic: [
        { id: 1, topicName: "Sport" },
        { id: 2, topicName: "News" },
        { id: 3, topicName: "Entertainment" }
      ],
      products: [
        {
          id: 1,
          linkName: "Olympics",
          description: "Olympics 2020 postpone",
          notes:
            "THE PRESIDENT OF THE INTERNATIONAL OLYMPIC COMMITTEE (IOC), THOMAS BACH, AND THE PRIME MINISTER OF JAPAN, ABE SHINZO, HELD A CONFERENCE CALL THIS MORNING TO DISCUSS THE CONSTANTLY CHANGING ENVIRONMENT WITH REGARD TO COVID-19 AND THE OLYMPIC GAMES TOKYO 2020.",
          url:
            "https://www.olympic.org/news/joint-statement-from-the-international-olympic-committee-and-the-tokyo-2020-organising-committee",
          category: "Sport",
          selected: false
        },
        {
          id: 2,
          linkName: "Fake",
          description: "Trump Tweet Something",
          notes:
            "The Radical Left Democrats have gone absolutely crazy that I am doing daily Presidential News Conferences. They actually want me to STOP! They used to complain that I am not doing enough of them, now they complain that I “shouldn’t be allowed to do them.” They tried to shame.....",
          url: "https://twitter.com/realDonaldTrump",
          category: "News",
          selected: false
        },
        {
          id: 3,
          linkName: "Netflix",
          description: "Excellent for training",
          notes:
            "In mid-January, a series of stories swept the entertainment industry press that suggested a seismic shift has happened in the way people watch TV and movies: Netflix started releasing viewership numbers for some of its biggest hits — and they were massive.",
          url: "https://www.netflix.com/ie/",
          category: "Entertainment",
          selected: false
        }
      ],

      originalProducts: [],
      //use for search
      search: {
        id: "",
        linkName: "",
        description: "",
        notes: "",
        url: "",
        category: ""
      },
      // Use for sorting
      sortItem: {
        column: null,
        direction: null
      }
    };
  },
   mounted () {
    this.$http
      .get('http://localhost:3000/api/posts')
      .then(response => {this.products=response.data.posts
      console.log(response.data)
      })
  }
  ,
  computed: {
    productCount() {
      return this.products.length;
    },
    lownotes() {
      return !this.isNew && this.notes < 5;
    },
    sortIconId() {
      return this.sortIcon("id");
    },
    sortIconlinkName() {
      return this.sortIcon("linkName");
    },
    sortIconDescription() {
      return this.sortIcon("description");
    },
    sortIconnotes() {
      return this.sortIcon("notes");
    },
    sortIconurl() {
      return this.sortIcon("url");
    },
    sortIconCategory() {
      return this.sortIcon("category");
    }
  },
  methods: {
    onFileChanged(event) {
      const file = event.target.files[0];
    },
    onUpload() {
      // upload file
    },
    productSearch() {
      if (this.originalProducts.length === 0) {
        this.originalProducts = [...this.products];
      }
      var results = this.products;
      if (this.search.id) {
        results = results.filter(data => {
          return this.search.id == data.id;
        });
      }
      if (this.search.linkName) {
        results = results.filter(data => {
          return this.search.linkName === data.linkName;
        });
      }
      if (this.search.description) {
        results = results.filter(data => {
          return data.description
            .toUpperCase()
            .includes(this.search.description.toUpperCase());
        });
      }
      if (this.search.url) {
        results = results.filter(data => {
          return this.search.url == data.url;
        });
      }
      if (this.search.category) {
        results = results.filter(data => {
          return this.search.category == this.gettopicID(data.category);
        });
      }
      this.products = results;
    },
    sortIcon(column) {
      if (column === this.sortItem.column) {
        if (this.sortItem.description === "up") {
          return "fas fa-sort-up";
        } else if (this.sortItem.description === "down") {
          return "fas fa-sort-down";
        }
      } else {
        return "";
      }
    },
    sortClick(column) {
      if (this.originalProducts.length === 0) {
        this.originalProducts = [...this.products];
      }
      this.sortItem.column = column;
      if (this.sortItem.direction === "up") {
        this.sortItem.direction = "down";
        this.products = this.products.sort(this.reverseCompare);
      } else {
        this.sortItem.description = "up";
        this.products = this.products.sort(this.compare);
      }
    },
    compare(a, b) {
      let itemA;
      let itemB;
      if (typeof a[this.sortItem.column] === "string") {
        itemA = a[this.sortItem.column].toUpperCase();
        itemB = b[this.sortItem.column].toUpperCase();
      } else {
        itemA = a[this.sortItem.column];
        itemB = b[this.sortItem.column];
      }
      if (itemA > itemB) {
        return 1;
      } else if (itemA < itemB) {
        return -1;
      } else {
        //a equals b
        return 0;
      }
    },
    reverseCompare(a, b) {
      return this.compare(b, a);
    },
    resetSearchSort() {
      if (this.originalProducts.length > 0) {
        this.products = [...this.originalProducts];
      }
      this.search.id = "";
      this.search.linkName = "";
      this.search.description = "";
      this.search.notes = "";
      this.search.url = "";
      this.search.category = "";
      this.search.column = null;
      this.search.direction = null;
    },
    validate() {
      this.isNew = false;
      var category = this.topic.filter(category => {
        return category.id == this.topicID;
      });
      //line 72 this.lownotes() wasn't wor	king
      if (
        !this.linkName ||
        this.linkName.length < 3 ||
        this.lownotes ||
        this.url < 10 ||
        category.length === 0
      ) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
      return this.isValid;
    },

    addProduct() {
      if (!this.validate()) {
        return;
      }
    const  newProduct = {
        id: this.getNextId(),
        linkName: this.linkName,
        description: this.description,
        notes: this.notes,
        url: this.url,
        topicID: this.topicID,
      };
      this.$http
      .post('http://localhost:3000/api/post/',newProduct)
      .then(response => {

      this.products.push(newProduct);
      this.resetProduct2();
      })


    },
    resetProduct2() {
      this.linkName = null;
      this.description = null;
      this.notes = 0;
      this.url = 0;
      this.topicID = null;
    },
    deleteProduct(event, row) {
      event.stopPropagation();
      if (
        confirm(
          `Are You Sure You Want To Delete The Product "${row.id}"?`
        )
      ) {

 console.log(row.id)
this.$http
      .delete('http://localhost:3000/api/post/'+row.id)
      .then(response => {
        const filteredProducts = this.products.filter(product => {
          return product.id !== row.id;
        });

        this.products = filteredProducts;

      })

      }
    },
    clickProduct(row) {
      this.products.forEach(product => {
        product.selected = false;
      });
      console.log(row)
      row.selected = true;
      this.id = row.id;
      this.linkName = row.linkName;
      this.description = row.description;
      this.notes = row.notes;
      this.url = row.url;
      this.topicID = this.gettopicID(row.topicID);
    },
    updateProduct() {
      if (!this.id) {
        alert("Please Select a product to update");
        return; //No product selected
      }
      if (!this.validate()) {
        return; //Not valid no more processing
      }
    const  currentProduct = {
        id: this.id,
        linkName: this.linkName,
        description: this.description,
        notes: this.notes,
        url: this.url,

			category: this.topicID,
      };
      console.log(
			"id"+ this.topicID)
      this.$http
      .put('http://localhost:3000/api/post/'+this.id,currentProduct)
      .then(response => {

      let arrayIndex;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == this.id) {
          arrayIndex = i;
          break;
        }
      }
      this.products[arrayIndex] = currentProduct;
      })


      this.resetProduct();
    },
    resetProduct() {
      this.isNew = true;
      this.id = null;
      this.linkName = null;
      this.description = null;
      this.notes = 0;
      this.topicID = null;
    },
    getNextId() {
      let max = 0;
      this.products.forEach(product => {
        if (product.id > max) {
          max = product.id;
        }
      });
      return max + 1;
    },
    gettopicID(name) {
      console.log(name);
      this.topicID=name;
      return name;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  margin: 1.2em;
}
.bg-dark {
  padding: 2em 11em 1em 5em;
  margin-top: 1em;
  margin-left: 0.8em !important;
  border-radius: 1.2em 0 0 1.2em;
}
.bg-info {
  padding: 0 11em 1em 33.7em;
  margin-top: 1em;
  border-radius: 0 1.2em 1.2em 0;
}
.fa-minus-circle {
  padding: 1em;
}
</style>
