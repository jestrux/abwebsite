
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('filters', require('./components/Filters.vue'));
Vue.component('question', require('./components/Question.vue'));
Vue.component('questions', require('./components/Questions.vue'));
Vue.component('question-modal', require('./components/QuestionModal.vue'));
Vue.component('questions-footer', require('./components/QuestionsFooter.vue'));
Vue.component('empty-state', function(resolve) {
  resolve(require('./components/EmptyState.vue'));
});
Vue.component('question-categories', require('./components/QuestionCategories.vue'));

window.app = new Vue({
    el: '#abella-cms',
    data: {
      filter: 0,
      all_questions: [],
      max: 9,
      buffer: 0, //buffered questions
      page: 1, //the current page
      numPages: 1,
      start: 1,
      end: 9
    },
    computed: {
      startIndex: function () {
        console.log("start: " + this.start);
        console.log("end: " + this.end);
        return this.start - 1;
      },
      questions: function () {

        if(this.filter == 0)
            return this.all_questions.slice(this.startIndex, this.end);
        else
            return this.all_questions
                       .filter(question => question.question_category_id == this.filter)
                       .slice(this.startIndex, this.end);
      },
      filteredQuestions: function () {

        if(this.filter == 0) {
          return this.all_questions;
        }
        else {
          return this.all_questions
                     .filter(question => question.question_category_id == this.filter);
        }

      }
    },
    created() {
      this.$on('archive', function(question_id) {
          var url= window.Laravel.base_url + '/admin/questions/' + question_id;
          axios.delete(url).then((response)=>{
              var questions = response.data;
              this.setAllQuestions(questions);
              // this.$emit('archived');
          }).catch((error)=>{
                  console.log(error.response.data)
          });
      });
      this.$on('changePage', function(page) {
        console.log("end: "+ this.end);
        this.page = page;
        this.setStart();
        this.buffer = this.filteredQuestions.length - (this.start - 1);
        this.setEnd();
        console.log("page: " + page);
        console.log("buffer: " + this.buffer);
      });
    },
    methods: {
      setStart: function() {
          if(this.page == 1)
            this.start = this.page;
          else
            this.start = (this.page - 1)*(this.max) + 1;
      },
      setEnd: function() {
          if(this.buffer >= this.max)
            this.end = this.start + (this.max - 1);
          else
            this.end = this.start + (this.buffer);
      },
      setAllQuestions: function(data) {
        this.all_questions = data;
        this.setBuffer();
        this.setNumPages();
      },
      onFilterClicked: function(filter) {
        this.filter = filter;
        this.setBuffer();
        this.setNumPages();
        this.page = 1;
        this.setStart();
        this.setEnd();
      },
      setNumPages: function() {
        var mod = this.filteredQuestions.length % this.max;
        var num = Math.trunc(this.filteredQuestions.length/this.max);
        if(mod != 0)
           num = num + 1;
        this.numPages = num;
      },
      setBuffer: function() {
        this.buffer = this.filteredQuestions.length;
      }
    }
});
