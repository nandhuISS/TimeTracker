(function() {
    
    'use strict';

    angular
        .module('timeTracker')
        .factory('time', time);

        function time($resource) {

            var Time = $resource('api/time/:id', {}, {
                update: {
                    method: 'PUT'
                }
            });
            
            function getTime() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Time.query().$promise.then(function(results) {
                	angular.forEach(results, function(result) {
                        result.loggedTime = getTimeDifference(result.start_time, result.end_time);
                    });
                    return results;
                }, function(error) { // Check for errors
                    console.log(error);
                });
            }

            function getTimeDifference(start,end){
            	var difference = moment(end).diff(moment(start));
            	var duration = moment.duration(difference);
            	return {duration:duration}
            }

            function getTotalTime(timeEntries){
            	var totMilliSeconds = 0;

            	angular.forEach(timeEntries,function(key){
            		totMilliSeconds += key.loggedTime.duration._milliseconds;
            	});

            	return{
            		hours: Math.floor(moment.duration(totMilliSeconds).asHours()),
         			minutes: moment.duration(totMilliSeconds).minutes()
            	}
            }

            function saveTime(data) {

                return Time.save(data).$promise.then(function(success) {
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });
            }

            function updateTime(data) {
                return Time.update({id:data.id}, data).$promise.then(function(success) {
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });
            }

            function deleteTime(id) {
                return Time.delete({id:id}).$promise.then(function(success) {
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });
            }

            return {
	            	getTime:getTime,
	            	getTimeDifference:getTimeDifference,
	            	getTotalTime:getTotalTime,
                    saveTime:saveTime,
                    updateTime:updateTime,
                    deleteTime:deleteTime
            	}

        }
})();