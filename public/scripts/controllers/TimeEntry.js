(function() {

  'use strict';
    
    angular
        .module('timeTracker')
        .controller('TimeEntry', TimeEntry);

        function TimeEntry(time,user,$scope) {

            // vm is our capture variable
            var vm = this;

            vm.timeentries = [];

            vm.totalTime = {};
            vm.users=[];

            vm.clockIn = moment();
      		vm.clockOut = moment();

            getTimeEntries();

            getUsers();

            function getUsers(){
                user.getUsers().then(function(result) {
                    vm.users = result;
                }, function(error) {
                  console.log(error);
                }); 

            }

            function getTimeEntries() {
                time.getTime().then(function(results) {
                  vm.timeentries = results;
                    updateTotalTime(vm.timeentries);
                    console.log(vm.timeentries);
                }, function(error) {
                    console.log(error);
                });
            } 

            

            function updateTotalTime(timeentries) {
                vm.totalTime = time.getTotalTime(timeentries);
            }

            vm.logNewTime = function() {

                if(vm.clockOut < vm.clockIn) {
                    alert("You can't clock out before you clock in!");
                    return;
		        }
		        if(vm.clockOut - vm.clockIn === 0) {
		          alert("Your time entry has to be greater than zero!");
		          return;
		        }

		        time.saveTime({
                    "user_id":vm.timeEntryUser.id,
                    "start_time":vm.clockIn,
                    "end_time":vm.clockOut,
                    "comment":vm.comment
                }).then(function(success) {
                    getTimeEntries();
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });

		        getTimeEntries();

                vm.clockIn = moment();
                vm.clockOut = moment();

		        vm.comment = "";

                vm.timeEntryUser = "";
		}

        vm.updateTimeEntry = function(timeentry) {
        
            // Collect the data that will be passed to the updateTime method
            var updatedTimeEntry = {
                "id":timeentry.id,
                "user_id":timeentry.user.id,
                "start_time":timeentry.start_time,
                "end_time":timeentry.end_time,
                "comment":timeentry.comment
            }
              
            time.updateTime(updatedTimeEntry).then(function(success) {
                getTimeEntries();
                $scope.showEditDialog = false;
                console.log(success);
            }, function(error) {
               console.log(error);  
            });
        }

        vm.deleteTimeEntry = function(timeentry) {
        
            var id = timeentry.id;

            time.deleteTime(id).then(function(success) {
                getTimeEntries();
                console.log(success);
            }, function(error) {
                console.log(error);
            });

        }
    }

})();