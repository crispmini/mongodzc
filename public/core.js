// public/core.js
var mongodzc = angular.module('mongodzc', []);

function mainController($scope, $http) {
    $scope.formData = {};
	$scope.edit = false;
	$scope.msg = "";

    // when landing on the page, get all units and show them
    $http.get('/api/units')
        .success(function(data) {
            $scope.units = data;
            console.log(data);
			$http.get('/api/weapons')
				.success(function(weaponsData) {
					$scope.weapons = weaponsData;
            		console.log(weaponsData);
			})
				.error(function(weaponsData) {
            		console.log('Error: ' + weaponsData);
				})
			})
        
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createUnit = function() {
		$scope.msg = "";
		if(!$scope.formData.faction || !$scope.formData.name || !$scope.formData.a || !$scope.formData.mv || !$scope.formData.dp || !$scope.formData.pts)
			$scope.msg = "Please fill out required sections"
		else{
        $http.post('/api/units', $scope.formData)
            .success(function(data) {
				$scope.msg = "";
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.units = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }};
	
	
	// edit a unit after checking it
	$scope.editUnit = function(id) {
		$http.get('/api/units/' + id)
			.success(function(data) {
				$scope.formData = data;
				$scope.edit = true;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
		})
			
	}
	
	// update a unit
	$scope.updateUnit = function() {
		$scope.msg = "";
		if(!$scope.formData.faction || !$scope.formData.name || !$scope.formData.a || !$scope.formData.mv || !$scope.formData.dp || !$scope.formData.pts)
			$scope.msg = "Please fill out required sections"
		else{
		$http.put('/api/units/' + $scope.formData._id, $scope.formData)
			.success(function(data){
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.units = data;
				$scope.edit = false;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			})
		}
	}
	
	// cancel update
	$scope.cancelEdit = function() {
		$http.get('/api/units')
			.success(function(data) {
				$scope.formData = {};
				$scope.units = data;
				$scope.edit = false;
			})
			.error(function(data) {
				console.log('Error: ' + data);
		})
	}

    // delete a unit after checking it
    $scope.deleteUnit = function(id) {
        $http.delete('/api/units/' + id)
            .success(function(data) {
                $scope.units = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	$scope.createWeapon = function() {
		if(!$scope.formWeapon)
			$scope.msg = "Please fill out required sections"
		else
		$http.post('/api/weapons', $scope.formWeapon)
            .success(function(data) {
				$scope.msg = "";
                $scope.formWeapon = {}; // clear the form so our user is ready to enter another
                $scope.units = data;
                console.log(data);
				$http.get('/api/weapons')
						.success(function(weaponsData) {
							$scope.weapons = weaponsData;
							console.log(weaponsData);
						})
						.error(function(weaponsData) {
							console.log('Error: ' + weaponsData);
						})
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
	}
	
	$scope.addWeapon = function (id) {
		$http.put('/api/units/' + id + '/' + $scope.selectedWeapon)
			.success(function() {
				$http.get('/api/units')
				.success(function(data) {
					$scope.units = data;
					console.log(data);
					$http.get('/api/weapons')
						.success(function(weaponsData) {
							$scope.weapons = weaponsData;
							console.log(weaponsData);
					})
						.error(function(weaponsData) {
							console.log('Error: ' + weaponsData);
						})
					})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			})
			.error(function() {
				console.log("failed reload");
			})
	}

}