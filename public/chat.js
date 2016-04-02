(function() {
   var app = angular.module('chat', []);
   
   app.controller('ChatController', function() {
      var socket = io();
      this.message = "";
      this.numCurrentUsers = -5;
      var ctrl = this;
      
      
      socket.on('chat message', function(msg) {
         $('#messages').append($('<li>').text(msg));
         $('#messages').scrollTop(function() { return this.scrollHeight; });
      });
      
      socket.on('userCount', function(newUserCount) {
         ctrl.numCurrentUsers = newUserCount;
      });
      
      this.submit = function() {
         socket.emit('chat message', this.message);
         this.message = '';
      };
   });
   
   app.controller('NavbarController', function() {
   
      this.submitFeedback = function() {
         alert('It\'s a feature.');
      };
   });

})();