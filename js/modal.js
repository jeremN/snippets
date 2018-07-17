class modal {
	//@param {name: string}
	constructor(name) {
		this.name = document.querySelector(name);
		this.body = document.querySelector('body');
		this.formChild = this.name.querySelector('form');

		let cancelBtn = this.name.querySelector('.form-btn-cancel');
		let closeBtn = this.name.querySelector('.btn-close');
		
		if(closeBtn) {
			closeBtn.addEventListener('click', this.hideModal.bind(this));
		}
		if(cancelBtn) {
			cancelBtn.addEventListener('click', this.hideModal.bind(this));
		}
		
		this.name.addEventListener('click', (e) => {
			if( e.srcElement.id === this.name.id) {
				this.hideModal();
			}
		});
	}

	showModal() {
		this.body.classList.add('noScroll')
		this.name.classList.add('popIn-open', 'animated', 'fadeIn');
		this.formChild.classList.add('animated', 'fadeInUp');
	}
	hideModal() {
		this.body.classList.remove('noScroll');
		this.formChild.classList.remove('animated', 'fadeInUp');
		this.name.classList.remove('popIn-open', 'animated', 'fadeIn');
	}
};

export default modal;