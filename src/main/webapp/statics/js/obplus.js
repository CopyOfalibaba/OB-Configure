angular.module('myApp',['ngGrid']);
function ctrl($scope,$http) {
	$http.get('../configdata/json').success(function(apps){
		$scope.apps = apps;
		if(apps.length != null) $scope.app = apps[0];
	})
	$scope.gridOptions = {
		data: 'data',
		columnDefs: 'columns',
		enableCellSelection: true,
		enableColumnResize: true,
		enableColumnReordering: true
	};
	$scope.$on('ngGridEventData',function(event,grid){
		angular.element('.ngViewport').css('height','300px').css('overflow','auto')
		});
	$scope.query = function(){
		var sql = $scope.sql;
		if(sql == undefined || $.trim(sql).length == 0) {
			alert("«Î ‰»Îƒ⁄»›");
			return;
		}
		var host = $scope.app.dataContent;
		$http.get('/obplus/execute?' + 'host=' + host + '&sql=' + sql).success(function(result){
			if(result.exception){
				alert(result.exception)				
			}else{
				$scope.show = true;
				$scope.data = result.rows;
				$scope.columns=result.meta;
			}
		})
	}

}