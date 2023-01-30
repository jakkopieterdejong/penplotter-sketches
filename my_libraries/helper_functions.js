function pol2cart(r, th) {return [r * cos(th), r * sin(th)]}

function angleBetween(a, b, n) {
	n = (360 + (n % 360)) % 360;
	a = (3600000 + a) % 360;
	b = (3600000 + b) % 360;

	if (a < b){return a <= n && n <= b;}
	return a <= n || n <= b;
}

const A3_dims = {'short': 297, 'long': 420};
const A4_dims = {'short': 210, 'long': 297};