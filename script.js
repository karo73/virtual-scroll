const initScroll = () => {

	// Functions
	const generateData = (arraySize) => {

		const data = new Array(arraySize).fill({
			name: "John",
			lastName: "Smith",
			text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci eveniet nam laboriosam, quas assumenda tempora fuga ut dignissimos quia consequuntur magnam sit aliquid ex cum quo similique nemo molestiae fugit aliquam repellendus voluptatibus? Delectus itaque sequi cupiditate laboriosam perspiciatis ab."
		});

		return data;
	}

	const getHtmlContent = ({ name, lastName, text, index }) => {

		const htmlTemplate = (
			`<div class="scroll__content" data-index="${index}">
				<h2 class="scroll__title">${name + " " + lastName + " - " + index}</h2>
				<p class="scroll__text">${text}</p>
			</div>`
		);

		return htmlTemplate;
	};

	const getScrollItemHeight = () => {

		const scrollContent = scroll.querySelector(".scroll__content");

		return scrollContent.offsetHeight + parseInt(getComputedStyle(scrollContent).marginBottom);
	};

	const renderItems = () => {

		let content = "",
			startIndex = start;

		while ( startIndex < end ) {

			content += getHtmlContent({...filledArr[startIndex], index: startIndex});

			startIndex++;

		}

		scroll.querySelector(".scroll__list").innerHTML = content;

	};

	const setPaddings = () => {

		const scrollItemHeight = getScrollItemHeight();

		scrollStartPadding.style.height = (start * scrollItemHeight) + "px";
		scrollEndPadding.style.height = ((scrollItemsCount - end) * scrollItemHeight) + "px";
	};

	const debounce = () => {

		let timer = null;

		return (cb, time = 250) => {
			if (timer !== null) {
				clearTimeout(timer);
			}
			timer = setTimeout(cb, time);
		};
		
	};

	const shouldReRender = () => {
		const startItem = scroll.querySelector(`.scroll__content[data-index="${start}"]`);
		const endItem = scroll.querySelector(`.scroll__content[data-index="${end-1}"]`);

		return !startItem || !endItem;
	};

	const onScrollHandler = (e) => {

		const scrollTop = e.target.scrollTop;
		const getScrolledCurrentIndex = Math.floor(scrollTop / getScrollItemHeight()) || 0;

		// Showing in the browser current item index
		scroll.querySelector(".scroll__item-number").innerHTML = Math.floor(getScrolledCurrentIndex);

		scrollEnd(() => {

			// Update start, end items
			start = getScrolledCurrentIndex;
			end = getScrolledCurrentIndex + limit;
			
			// Decreasing displayed items by average of limit in order to have current item in the middle of renderer items
			start -= rendererItemsAverage;
			end -= rendererItemsAverage;

			// Check not to display unavailable items
			if (start <= 0) {
				start = 0;
				end = limit;
			} else if (end >= scrollItemsCount) {
				start = scrollItemsCount - limit;
				end = scrollItemsCount;
			}

			// Check should re-render
			if (shouldReRender()) {
				reRender();
				e.target.scrollTop = scrollTop;
			}

		});
		
	};

	const reRender = () => {
		renderItems();
		setPaddings();
	};

	// Constants
	const limit = 10;
	const scrollItemsCount = 100_000;
	const filledArr = generateData(scrollItemsCount);
	const scroll = document.querySelector(".scroll");
	const scrollWrapper = scroll.querySelector(".scroll__wrapper");
	const scrollStartPadding = scroll.querySelector(".scroll__start-padding");
	const scrollEndPadding = scroll.querySelector(".scroll__end-padding");
	const rendererItemsAverage = Math.floor(limit / 2);
	const scrollEnd = debounce();

	// Variables
	let start = 0,
		end = limit;

	// Init functional
	reRender();
	scrollWrapper.onscroll = onScrollHandler;

};

// Document ready event
document.addEventListener("DOMContentLoaded", initScroll);