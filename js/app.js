// tabs [simplified]
const tabs = document.querySelectorAll('.tabheader__item'),
	  tabsParent = document.querySelector('.tabheader__items'),
 	  tabsContent = document.querySelectorAll('.tabcontent');

function addHide(smt) {
	smt.classList.add('hide')
	smt.classList.remove('show')
}

function addShow(smt) {
	smt.classList.add('show')
	smt.classList.remove('hide')
}


function hideTabsContent() {
	tabsContent.forEach(item => {
		addHide(item)
		item.classList.remove('animate')
	})

	tabs.forEach(item => {
		item.classList.remove('tabheader__item_active')
	})
}

function showTabsContent(i) {
	tabsContent[i].classList.add('animate')
	addShow(tabsContent[i])

	tabs[i].classList.add('tabheader__item_active')
}

hideTabsContent()
showTabsContent(0)


tabsParent.addEventListener('click', (e) => {
	tabs.forEach((item, i) => {
		if (e.target === item) {
			hideTabsContent()
			showTabsContent(i)
		}
	})
})

// modal [simplified]
const modalTrigger = document.querySelectorAll('[data-modal]'),
	  modal = document.querySelector('.modal')

function openModal () {
	addShow(modal)
	document.body.style.overflow = 'hidden'

	clearInterval(timeOutId)
}

function closeModal () {
	addHide(modal)
	document.body.style.overflow = 'auto' 
}

modalTrigger.forEach( item => {
	item.addEventListener('click', () => {
		openModal()
	})
})

modal.addEventListener('click', (e) => {
	if (e.target === modal || e.target.classList.contains('modal__close')) {
		closeModal ()
	}
})

document.body.addEventListener('keydown', (e) => {
	if (e.code === 'Backspace') {
		closeModal ()
	}
})

function openModalScroll (){
	const page = document.documentElement
	if(page.clientHeight + page.scrollTop >= page.scrollHeight) {
		openModal()
		window.removeEventListener('scroll', openModalScroll)
	}
}

window.addEventListener('scroll', openModalScroll)

const timeOutId = setTimeout(openModal, 5000)

// clock [simplified]

// const deadline = '2022-03-01'
const deadline = '2020-03-01'

function getTimeRemaining(deadline) {
	const t =  new Date(deadline) - new Date(),
	days = Math.floor((t / (1000 * 60 * 60 * 24))),
	hours = Math.floor((t / (1000 * 60 * 60) % 24)),
	minutes = Math.floor((t / 1000 / 60) % 60),
	seconds = Math.floor((t / 1000) % 60);

	return {
		"total": t,
		"days": days,
		"hours": hours,
		"minutes": minutes,
		"seconds": seconds
	}
	
}


function setClock(element, deadline) {
	const e = document.querySelector(element),
		days = e.querySelector('#days'),
		hours = e.querySelector('#hours'),
		minutes = e.querySelector('#minutes'),
		seconds = e.querySelector('#seconds');

	setInterval(updateClock, 1000)

	updateClock()


	function getZero(num) {
		if (num < 10) {
			return `0${num}`
		} else {
			return num
		}
	}

	function updateClock() {
		const t = getTimeRemaining(deadline); 
		if (t.total < 0) {
			days.innerHTML = 0;
			hours.innerHTML = 0;
			minutes.innerHTML = 0;
			seconds.innerHTML = 0
		} else {
			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds)
		}
	}
}
setClock('.timer', deadline)

// cards

class Cards {
	constructor(src, title, desc, price, alt){
		this.src = src
		this.title = title
		this.desc = desc 
		this.price = price
		this.alt = alt
	}

	render() {
		const wrapper = document.querySelector('#cardWrapper')
		const card = document.createElement('div')
		card.classList.add('menu__item')

		card.innerHTML = `
			<div class="menu__item">
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.desc}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			</div>
		`

		wrapper.append(card)
	}
}

const card1 = new Cards('img/tabs/elite.jpg', 'Меню “Премиум”', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 550, 'alt')
card1.render()
const card2 = new Cards("img/tabs/post.jpg", 'Меню "Постное"', 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 430, "post")
card2.render()
const card3 = new Cards("img/tabs/vegy.jpg", 'Меню "Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 229, 'vegy')
card3.render()

// form
const forms = document.querySelectorAll('form')

forms.forEach(item => {
	postData(item)
})

const massage = {
	success: 'Спасибо, ожидайте ответа !',
	fail: 'Что-то пошло не так',
}


function postData (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault()
		const massageBlock = document.createElement('div')

		massageBlock.style.cssText = `
		margin-top: 25px;
		text-align: center;
		`
		form.insertAdjacentElement('afterend', massageBlock)
		const formData = new FormData(form)
		const obj = {}

		formData.forEach((item, i) => {
			obj[i] = item
		})

		const json = JSON.stringify(obj)

		fetch('server.php', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: json
		}).then(() => {
			showResultModal(massage.success)
		}).catch(() => {
			showResultModal(massage.fail)
		}).finally(() => {
			form.reset()
			massageBlock.remove()
		})

		massageBlock.classList.add('loader')
	})
}

function showResultModal (massage) {
	openModal()
	const prevModal = document.querySelector('.modal__dialog')
	prevModal.classList.add('hide')

	const resultModal = document.createElement('div')
	resultModal.classList.add('modal__dialog')

	resultModal.innerHTML = `
	<div class="modal__content">
			<div class="modal__close">x</div>
			<div class="modal__title">${massage}</div>
	</div>
	`
	modal.append(resultModal)

	setTimeout(() => {
		prevModal.classList.remove('hide')
		closeModal()
		resultModal.remove()
	}, 2000)
}








// slider
const slides = document.querySelectorAll('.offer__slide'),
	next = document.querySelector('.offer__slider-next'),
	prev = document.querySelector('.offer__slider-prev'),
	current = document.querySelector('#current'),
	total = document.querySelector('#total');

let counter = 1

if (counter > 10) {
	total.textContent = slides.length
} else {
	total.textContent = `0${slides.length}`
}


showSlide(counter)


function showSlide(i){
	if(i > slides.length){
		counter = 1
	}

	if(i < 1){
		counter = slides.length
	}

	if(i > 10){
		current.textContent = counter
	} else {
		current.textContent = `0${counter}`
	}

	slides.forEach(item => {
		item.style.display = 'none'
		item.classList.remove('animate')
	})

	slides[counter - 1].style.display = 'block'
	slides[counter - 1].classList.add('animate')
}

prev.addEventListener('click', () => {
	showSlide(counter -= 1)
})

next.addEventListener('click', () => {
	showSlide(counter += 1)
})






