class formValidation {
	
	//@param {form: html element}
	//@param {config: object}
	constructor(form, config) {

		this.controlRegEx = {
			contactFormHasError: '',
			nameRegExp: /\d/, /* /^[a-zA-Z]{2,20}$/ */
			emailRegexp: /^[a-zA-Z0-9._+-]+@[a-z0-9-]{1,67}\.[a-zA-Z]{2,67}$/,
			phoneRegexp: /^0[1-9]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/,
			ibanRegexp: /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/,
			bicRegexp: /([a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?)/,
			stringRegexp: /^\s+|<|>|"|\$|&|\/|'|\*|#|@|\\|\.\.|\./,
			urlRegexp: /^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU|fr|Fr|it|eng|ca)$/,
			passwordRegexp:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%_*?&])[A-Za-z\d$@$_!%*?&]{6,12}/, /* /(?=^.{8,12}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/*/
			msgRegexp: /^\s+$/,
			numRegexp: /^[0-9]+$/,
			siretRegex: /^[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{5}$/
		}

		this.form = form;
		this.fields = config;
		this.hasError = '';
		this.fileExtension = ['.jpg', '.jpeg', '.gif', '.pdf', '.png'];
	}

	//@param {errorMsg: string}
	//@param {fieldId: html element}
	showErrorMsg(errorMsg, fieldId) {

		this.hasError = true;

		let formRow = document.querySelector(fieldId).closest('.form-group'),
			errorMsgContainer = formRow.querySelector('.form-error');

		if(errorMsgContainer === null || errorMsgContainer === undefined ) {
			errorMsgContainer = document.createElement('div');
			errorMsgContainer.classList.add('form-error');
			formRow.appendChild(errorMsgContainer);
		}

		if(formRow.classList.contains('is-valid')) {
			formRow.classList.remove('is-valid');
		}

		formRow.classList.add('has-error');
		errorMsgContainer.innerHTML = errorMsg;
	}

	//@param {fieldId: html element}
	clearError(fieldId) {

		let formRow = document.querySelector(fieldId).closest('.form-group'),
			errorMsgContainer = formRow.querySelector('.form-error');

		formRow.classList.remove('has-error');
		formRow.classList.add('is-valid');
		
		if(errorMsgContainer) {
			errorMsgContainer.innerHTML = '';
		}
	}

	controlError() {
		let errors = document.querySelectorAll(`${this.form} .has-error`);
		return errors.length ? true : false;
	}

	//@param {array: html elements}
	inputIsChecked(array) {
		let max = array.length;

		for(let i = 0; i < array.length; i++) {
			if(array[i].checked) {
				return true;
			}
		}
		return false;
	}
	//https://stackoverflow.com/questions/4234589/validation-of-file-extension-before-uploading-file
	hasExtension(fieldId, extension) {
		let fileName = document.querySelector(fieldId).value;
		return (new RegExp('(' + extension.join('|').replace(/\./g, '\\.') + ')$', "i")).test(fileName);
	}

	//@param {fieldValue: numbers}
	inputIsSiret(fieldValue) {
		let sum = 0;
		let tmp = 0;

		for( let i = 0; i < 14; i++) {
			if(i % 2 == 0) {
				tmp = parseInt(fieldValue[i], 10) * 2;
				tmp = tmp > 9 ? tmp - 9 : tmp;
			}
			else {
				tmp = parseInt(fieldValue[i], 10);
			}
			sum += tmp;
		}

		if(sum % 10 !== 0) {
			return false;
		}
		return true;
	}

	//@param {e: event}
	validate(e) {

		e.preventDefault();

		let elFields = this.fields;
		this.hasError = false;

		for (let field in elFields) {

			let el = document.querySelector(field),
				elVal = el.value.trim(),
				elChecked,
				elSiret = elVal.replace(/\s/g, ''),
				luhnAlgo = this.inputIsSiret(elSiret);

			//Requis ET vide
			if(elFields[field].required && !elVal) {
				this.showErrorMsg('Merci de renseigner ce champ ', field);
			}

			//Trop court
			else if(elVal.length < elFields[field].minlength) {
				this.showErrorMsg(`Ce champ doit faire plus de ${elFields[field].minlength} caractères`, field)
			}

			//Trop long
			else if(elVal.length > elFields[field].maxlength) {
				this.showErrorMsg(`Ce champ doit faire moins de ${elFields[field].maxlength} caractères`, field);
			}

			//Chiffre seulement
			else if(elFields[field].isNumeric && !this.controlRegEx.numRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.numeric, field);
			}

			//Controle email
			else if(elFields[field].isEmail && !this.controlRegEx.emailRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.email, field);
			}

			//Password
			else if(elFields[field].isPassword && !this.controlRegEx.passwordRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.password, field);
			}
			else if(elFields[field].isNotFound && el.classList.contains('not-found')) {
				this.showErrorMsg(elFields[field].errorMessages.notFound, field);
			}

			//Phone
			else if(elFields[field].isPhone && !this.controlRegEx.phoneRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.phone, field);
			}
/*
			//Siret
			else if(elFields[field].isSiret && !this.controlRegEx..test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.siret, field);
			}
*/
			else if(elFields[field].isSiret && elSiret.length !== 14) {
				this.showErrorMsg(elFields[field].errorMessages.siretLength, field);
			}
			else if(elFields[field].isSiret && !this.controlRegEx.numRegexp.test(elSiret)) {
				this.showErrorMsg(elFields[field].errorMessages.siretNum, field);
			}
			else if(elFields[field].isSiret && !luhnAlgo) {
				this.showErrorMsg(elFields[field].errorMessages.siretAlgo, field);
			}

			//Iban
			else if(elFields[field].isIban && !this.controlRegEx.ibanRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.iban, field);
			}

			//Bic
			else if(elFields[field].isBic && !this.controlRegEx.bicRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.bic, field);
			}

			//Select
			else if(elFields[field].isSelect && !elVal) {
				this.showErrorMsg(elFields[field].errorMessages.select, field);
			}

			//Url
			else if(elFields[field].isUrl && !this.controlRegEx.urlRegexp.test(elVal)) {
				this.showErrorMsg(elFields[field].errorMessages.url, field)
			}

			//Radio & Checkbox
			else if(elFields[field].isChecked) {
				
				let elType = el.type,
					elName = el.name;

				if(elType === 'radio') {
					let radios = Array.from(document.querySelectorAll(`input[name="${elName}"]`));
					let isChecked = this.inputIsChecked(radios);
					if(!isChecked) {
						this.showErrorMsg(elFields[field].errorMessages.checked, field);
					}
					else {
						this.clearError(field);
					}
				}
				else {
					if(!el.checked) {
						this.showErrorMsg(elFields[field].errorMessages.checked, field);
					}
					else {
						this.clearError(field);
					}
				}
			}  

			//File extension
			else if(elFields[field].isFile) {
				let testExt = this.hasExtension(field, this.fileExtension);
				if(!testExt) {
					this.showErrorMsg(elFields[field].errorMessages.file, field);
				}
				else {
					this.clearError(field);
				}
			}

			//Clear errors
			else if(elFields[field].required && elVal 
					|| elVal.length > elFields[field].minlength 
					|| elVal.length < elFields[field].maxlength 
					|| elFields[field].isNumeric && this.controlRegEx.nameRegExp.test(elVal)
					|| elFields[field].isEmail && this.controlRegEx.emailRegexp.test(elVal)
					|| elFields[field].isPassword && this.controlRegEx.passwordRegexp.test(elVal)
					|| elFields[field].isNotFound && !el.classList.contains('not-found')
					|| elFields[field].isPhone && this.controlRegEx.phoneRegexp.test(elVal)
//					|| elFields[field].isSiret && this.controlRegEx.siret.test(elVal)
					|| elFields[field].isIban && this.controlRegEx.ibanRegexp.test(elVal)
					|| elFields[field].isPassword && this.controlRegEx.bicRegexp.test(elVal)
					|| elFields[field].isUrl && this.controlRegEx.urlRegexp.test(elVal)
					|| elFields[field].isSiret && this.controlRegEx.numRegexp.test(elSiret)
					|| elFields[field].isSiret && elSiret.length === 14
					|| elFields[field].isSiret && luhnAlgo
					|| elFields[field].isSelect && elVal) {
				this.clearError(field);
			} 
		}
	}

	sendData() {
		console.log('Envoi du formulaire');
		/*
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data)
			headers: {'Content-Type': 'application/json'}
		})
		.then(res => res.json())
		.catch(error => console.error(error))
		.then(response => console.log(response));
		*/
		//fetch(); || http request POST
		//document.querySelector(`${this.Form}`).reset();

	}
}

export default formValidation;