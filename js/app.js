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
	  modal = document.querySelector('.modal'),
      modalCloseBtn = document.querySelector('.modal__close')

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

modalCloseBtn.addEventListener('click', () => {
	closeModal ()
})

modal.addEventListener('click', (e) => {
	if (e.target === modal) {
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

		const request = new XMLHttpRequest()
		request.open('POST', 'server.php')
		// request.setRequestHeader('Content-type', 'application/json')

		const formData = new FormData(form)
		request.send(formData)

		massageBlock.classList.add('loader')

		request.addEventListener('load', () => {
			if(request.status === 200){
				massageBlock.textContent = massage.success
				massageBlock.classList.remove('loader')
			} else {
				massageBlock.textContent = massage.fail
				massageBlock.classList.remove('loader')
			}
			form.reset()
		})
	})
}

// slider
const slides = document.querySelectorAll('.offer__slide'),
	next = document.querySelector('.offer__slider-next'),
	prev = document.querySelector('.offer__slider-prev'),
	current = document.querySelector('#current');

let counter = 1

showSlide(counter)


function showSlide(i){
	if(i > slides.length){
		counter = 1
	}

	if(i < 1){
		counter = slides.length
	}

	if(i > 5){
		current.textContent = counter
	} else {
		current.textContent = `0${counter}`
	}

	slides.forEach(item => {
		item.style.display = 'none'
	})

	slides[counter - 1].style.display = 'block'
}

prev.addEventListener('click', () => {
	showSlide(counter -= 1)
})

next.addEventListener('click', () => {
	showSlide(counter += 1)
})






