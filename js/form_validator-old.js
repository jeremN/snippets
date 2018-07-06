$(document).ready(function(){

	var formValidation = function(formName){

		var contactFormHasError = false;

		//Error message display
		var displayErrorMessage = function(errorMessage, fieldId){

			contactFormHasError = true;

			var formRow = $(fieldId).parent();

			if ( formRow.has(".msg-info").length == 0 ){
				var errorMessageContainer = $("<div>").addClass("msg-info error-msg");
				formRow.append(errorMessageContainer);
			}
			else {
				var errorMessageContainer = formRow.children(".msg-info");
			}

			formRow.addClass("has-error");
			errorMessageContainer.html(errorMessage);
		}
		 
		//Clear error
		var clearError = function(fieldId){
			var formRow = $(fieldId).parent();
			formRow.removeClass("has-error");
			formRow.children(".error-msg").remove();
		}

		//Verify form
		var validateContactForm = function(e){

			contactFormHasError = false;
			e.preventDefault();

			//Regex
			var nameRegExp  = /\d/, /* /^[a-zA-Z]{2,20}$/ */
				emailRegexp = /^[a-zA-Z0-9._+-]+@[a-z0-9-]{1,67}\.[a-z]{2,67}$/,
				phoneRegexp =/^0[1-9]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/;
				/*
				stringRegexp = /^\s+|<|>|"|\$|&|\/|'|\*|#|@|\\|\.\.|\./,
				msgRegexp = /^\s+$/;
				*/

			//Fields
			var lastnameField = $(this).find("input[name='lastname']"),
				firstnameField = $(this).find("input[name='firstname']"),
				mailField = $(this).find("input[name='email']"),
				mailconfirmField = $(this).find("input[name='emailconfirm']"),
				phoneField = $(this).find("input[name='phone']"),
				mobilephoneField = $(this).find("input[name='mobilephone']");

			//Name validation
			if( lastnameField.length ){

				var lastnameVal = lastnameField.val().trim();

				if (lastnameVal == ""){
					displayErrorMessage("Veuillez renseigner votre nom !", "input[name='lastname']");
				}
				else if(lastnameVal.length <= 1){
					displayErrorMessage("Votre nom est trop court !", "input[name='lastname']");
				}
				else if(nameRegExp.test(lastnameVal)){
					displayErrorMessage("Pas de chiffre dans le nom!", "input[name='lastname']");
				}
				else {
					clearError("input[name='lastname']");
				}
			}

			//FirstName validation
			if( firstnameField.length ){

				var firstnameVal = firstnameField.val().trim();

				if (firstnameVal == ""){
					displayErrorMessage("Veuillez renseigner votre prénom !", "input[name='firstname']");
				}
				else if(firstnameVal.length <= 1){
					displayErrorMessage("Votre prénom est trop court !", "input[name='firstname']");
				}
				else if(nameRegExp.test(firstnameVal)){
					displayErrorMessage("Pas de chiffre dans le prénom !", "input[name='firstname']");
				}
				else {
					clearError("input[name='firstname']");
				}
			}

			//Email validation
			if( mailField.length ){

				var mailVal = mailField.val().trim();

				if (mailVal == ""){
					displayErrorMessage("Veuillez renseigner votre email !", "input[name='email']");
				}
				else if( emailRegexp.test(mailVal) === false ){
					displayErrorMessage("Votre email n'est pas valide !", "input[name='email']");
				}
				else {
					clearError("input[name='email']");
				}
			}

			//Email confirm validation
			if( mailconfirmField.length ){

				var mailConfirmVal = mailconfirmField.val().trim();

				if (mailConfirmVal == ""){
					displayErrorMessage("Veuillez confirmer votre email !", "input[name='emailconfirm']");
				}
				else if( emailRegexp.test(mailConfirmVal) === false ){
					displayErrorMessage("Votre email n'est pas valide !", "input[name='emailconfirm']");
				}
				else if( $("input[name='email']").val() != $("input[name='emailconfirm']").val() ){
					displayErrorMessage("La confirmation est incorrecte !", "input[name='emailconfirm']");
				}
				else {
					clearError("input[name='emailconfirm']");
				}
			}

			//Phone validation
			if( phoneField.length ){

				var phoneVal = phoneField.val().trim();

				if(phoneVal == ""){
					displayErrorMessage("Votre téléphone est obligatoire !", "input[name='phone']");
				}
				else if(phoneVal.length < 6){
					displayErrorMessage("Votre numéro est incomplet !", "input[name='phone']");
				}
				else if(phoneRegexp.test(phoneVal) === false){
					displayErrorMessage("Votre numéro est incorrect", "input[name='phone']");
				}
				else{
					clearError("input[name='phone']");
				}
			}

			//Mobile phone validation
			if( mobilephoneField.length ){

				var mobilePhoneVal = mobilephoneField.val().trim();

				if(mobilePhoneVal == ""){
					displayErrorMessage("Votre téléphone est obligatoire !", "input[name='mobilephone']");
				}
				else if(mobilePhoneVal.length <= 5){
					displayErrorMessage("Votre numéro est incomplet !", "input[name='mobilephone']");
				}
				else if(phoneRegexp.test(mobilePhoneVal) === false){
					displayErrorMessage("Votre numéro est incorrect", "input[name='mobilephone']");
				}
				else{
					clearError("input[name='mobilephone']");
				}
			}
	/*
			//Surface validation
			var surfaceMinVal = $("#inputSurface").val().trim();
			var surfaceMaxVal = $('#inputSurfaceMax').val().trim();
			if( surfaceMinVal == "" && surfaceMaxVal == ""){
				displayErrorMessage("Merci d'indiquer une valeur min et max !", "#inputSurface");
			}
			else if(!$.isNumeric(surfaceMinVal) ){
				displayErrorMessage("Veuillez saisir un nombre", "#inputSurface");
			}
			else if(!$.isNumeric(surfaceMaxVal)){
				displayErrorMessage("Veuillez saisir un nombre", "#inputSurfaceMax");
			}
			else if( surfaceMinVal >= surfaceMaxVal ){
				displayErrorMessage("Le maximum doit être supérieur au minimum", "#inputSurfaceMax");
			}
			else{
				clearError("#inputSurface");
				clearError("#inputSurfaceMax");
			}
			//Ground surface validation
			var groundMinVal = $("#inputGround").val().trim();
			var groundMaxVal = $('#inputGroundMax').val().trim();
			if( $('#inputTypeProperty').val() == "Maison"){
				if( groundMinVal == "" && groundMaxVal == ""){
					displayErrorMessage("Merci d'indiquer une valeur min et max !", "#inputGround");
				}
				else if(!$.isNumeric(groundMinVal) ){
					displayErrorMessage("Veuillez saisir un nombre", "#inputGround");
				}
				else if(!$.isNumeric(groundMaxVal)){
					displayErrorMessage("Veuillez saisir un nombre", "#inputGroundMax");
				}
				else if( groundMinVal >= groundMaxVal ){
					displayErrorMessage("Le maximum doit être supérieur au minimum", "#inputGroundMax");
				}
				else{
					clearError("#inputGround");
					clearError("#inputGroundMax");
				}
			}
			else{
				clearError("#inputGround");
				clearError("#inputGroundMax");
			}
			//City validation
			var cityVal = $("#inputPostCode").val().trim();
			if(cityVal == ""){
				displayErrorMessage("Merci d'indiquer une ville", "#inputPostCode");
			}
			else if(cityVal.length <= 2){
				displayErrorMessage("Veuillez taper au moins 3 caractères", "#inputPostCode");
			}
			else{
				clearError("#inputPostCode")
			}
	*/

			//Form submit
			if (contactFormHasError == false){
				$(this).off("submit");
				$(this).submit();
			}
			else {
				$(".has-error").first().focus();
			}
		}

		$(formName).submit(validateContactForm);
	}

	formValidation('#form-lastimmo');

});