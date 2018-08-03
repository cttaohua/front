function random(num) {
	var integer = '1';
	for(var i=0;i<(num);i++) {
		integer = integer + '0';
	}
	return Math.floor(Math.random()*(integer));
}

module.exports = {
	random: random
}