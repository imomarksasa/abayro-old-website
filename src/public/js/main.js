// require('../css/abayro.css')
// import 'bootstrap/dist/js/bootstrap.min.js'
// import 'mdbootstrap/js/mdb.min.js'

$(document).ready(() => {
	$('.counter').each(function() {
		const $this = $(this);
		const countTo = $this.attr('data-count');
		$({ countNum: $this.text() }).animate({
			countNum: countTo
		},
		{
			duration: 3500,
			easing: 'linear',
			step() {
				$this.text(Math.floor(this.countNum));
			},
			complete() {
				$this.text(this.countNum);
			}
		});
	});
	$('.dropdown').on('show.bs.dropdown', function() {
		$(this).find('.dropdown-menu').first()
			.stop(true, true)
			.slideDown(150);
	});
	$('.dropdown').on('hide.bs.dropdown', function() {
		$(this).find('.dropdown-menu').first()
			.stop(true, true)
			.slideUp(150);
	});
	document.getElementById('change-theme').addEventListener('click', () => {
		const darkThemeEnabled = document.body.classList.toggle('dark-theme');
		localStorage.setItem('dark-theme-enabled', darkThemeEnabled);
	});
	if (JSON.parse(localStorage.getItem('dark-theme-enabled'))) {
		document.body.classList.add('dark-theme');
	} else {
		document.body.classList.remove('dark-theme');
	}
});