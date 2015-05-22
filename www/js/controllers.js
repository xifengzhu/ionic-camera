angular.module('ionic-camera.controllers', [])

.controller('HomeCtrl', ['$scope', "CameraPopover", "$ionicActionSheet",function($scope, CameraPopover, $ionicActionSheet){
    $scope.showProgress = false;

  var uploadFileUrl = "your serve api";

  $scope.showActionSheet = function(){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Take Phone from albums' }
      ],
      // destructiveText: 'Delete',
      titleText: 'Select photos from',
      cancelText: 'Cancel',
      cancel: function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        // click "take phone"
        if(index == 0){
          takePicture({
            quality : 100,
            allowEdit : true,
            targetWidth: 500,
            targetHeight: 225,
            // Android doesn't recognize this.
            // http://stackoverflow.com/questions/29392639/error-capturing-image-with-phonegap-on-android
            // saveToPhotoAlbum: true,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          });
        }else if(index == 1){
          takePicture({
            quality : 100,
            allowEdit : true,
            targetWidth: 500,
            targetHeight: 225,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          });
        }else{
          return true;
        }
        hideSheet();
      }
    });
  };

  // upload file with a imageURI
  var uploadFile = function(imageURI){
    // show the progress bar
    safeApply( $scope, function(){
      $scope.showProgress = true;
    });
    var uploadOptions = new FileUploadOptions();
    uploadOptions.fileKey = "avatar";
    uploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    uploadOptions.mimeType = "image/jpeg";
    uploadOptions.chunkedMode = false;

    var ft = new FileTransfer();

    var statusDom = document.getElementById("ft-prog");

    ft.onprogress = function(progressEvent) {
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        statusDom.value = perc;
        if(perc == 100){
          safeApply($scope, function(){
            $scope.showProgress = false;
          });
        }
      } else {
        console.log("loading....");
      }
    };

    ft.upload(imageURI, encodeURI(uploadFileUrl), onSuccess, onFail, uploadOptions, true);

    function onSuccess(responseData){
      // FIXME: if use responseData.response.avatar_thumb_url will get a undefined
      responseString = JSON.stringify(responseData);
      responseObject = JSON.parse(responseString);
      responsePerson = JSON.parse(responseObject.response);
      safeApply($scope, function(){
        // update your url
        // $scope.person.avatar_square_url = responsePerson.avatar_square_url;
      });
    };
    function onFail(){
      alert("something wrong, please try again");
    };
  };

  //get photos form device and return a file path url
  var takePicture = function(options) {
    CameraPopover.getPicture(options).then(function(imageURI){
      uploadFile(imageURI);
    }, function(err){
      console.error(err);
    });
  };

}])
