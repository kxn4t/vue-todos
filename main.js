ELEMENT.locale(ELEMENT.lang.en);

// localStorage
var STORAGE_KEY = 'todos-vuejs-demo';
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

var app = new Vue({
  el: '#app',

  data: {
    todos: [],
    comment: '',
    rate: 0,
    current: -1,
    options: [{
        value: -1,
        label: 'All'
      },
      {
        value: 0,
        label: 'Doing'
      },
      {
        value: 1,
        label: 'Done'
      }
    ]
  },

  computed: {
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    },

    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, {
          [b.value]: b.label
        });
      }, {});
    },
  },

  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos);

        var todosCount = this.todos.length;
        var doneCount = this.todos.filter(function (value) {
          return value.state == 1;
        }).length;
        this.rate = todosCount == 0 ? 0 : (doneCount / todosCount) * 100;
      },
      deep: true
    }
  },

  created() {
    this.todos = todoStorage.fetch();
  },

  methods: {
    doAdd: function (event, value) {
      var comment = this.comment;
      if (!comment) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment,
        state: 0
      });
      this.comment = '';
    },

    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0;
    },

    doRemove: function (item) {
      var index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    }
  }
});