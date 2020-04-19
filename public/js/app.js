const app = angular.module('mailMonkey', [])

app.controller('MailController', function ($scope, $http) {
  $scope.error = false
  $scope.success = false

  this.$onInit = function () {
    $scope.loadEmails()
  }

  $scope.refresh = function () {
    $scope.loadEmails()
  }

  $scope.loadEmails = function () {
    $http({
      method: 'GET',
      url: 'api/emails'
    }).then(function (response) {
      $scope.emails = response.data
    }, function () {
      $scope.showAlert(false, "Couldn't load the email list. Please try again..")
    })
  }

  $scope.loadEmail = function (id) {
    for (const i in $scope.emails) {
      if ($scope.emails[i].id === id) {
        $scope.email = $scope.emails[i]
      }
    }
  }

  $scope.deleteEmail = function (id) {
    if (confirm('Are you sure you want to delete this email?')) {
      $http({
        method: 'DELETE',
        url: 'api/emails/' + id
      }).then(function () {
        delete $scope.email
        $scope.showAlert(true, 'Email successfully deleted.')
        $scope.loadEmails()
      }, function () {
        $scope.showAlert(false, "Couldn't delete the email. Please try again.")
      })
    }
  }

  $scope.relayEmail = function (id) {
    if (confirm('Are you sure you want to relay this email?')) {
      $http({
        method: 'POST',
        url: 'api/emails/relay/' + id
      }).then(function () {
        $scope.showAlert(true, 'Email successfully relayed.')
      }, function (response) {
        $scope.showAlert(false, response.data.message || response.statusText)
      })
    }
  }

  $scope.getIframeUrl = function (id) {
    return 'api/emails/' + id + '/html'
  }

  $scope.closeAlert = function () {
    $scope.error = false
    $scope.success = false
  }

  $scope.showAlert = function (success, message) {
    $scope.closeAlert()

    if (success) {
      $scope.success = true
    } else {
      $scope.error = true
    }

    $scope.alertMessage = message
  }
})
