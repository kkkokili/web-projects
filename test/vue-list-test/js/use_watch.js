new Vue({
  el: "#app",
  data: {
    key: '',
    persons: [
      {
        id: "001",
        name: "马冬梅",
        age: "18",
      },
      {
        id: "002",
        name: "周冬雨",
        age: "32",
      },
      {
        id: "003",
        name: "周杰伦",
        age: 32,
      },
      {
        id: "004",
        name: "温兆伦",
        age: 34,
      },
    ],
    filPersons: []
  },
  watch: {
    key: {
      immediate: true,
      handler(val) {
        this.filPersons=this.persons.filter(item=> item.name.indexOf(val)!=-1)
      }      
    }
  }
});
