'use strict';

const map = require('through2-map').obj;
const numpad = require('numpad');
const csv = require('csv-write-stream');
const paylike = require('paylike')(process.env.PAYLIKE_KEY);

paylike.merchants.lines
	.find(process.argv[2])
	.stream()
	.pipe(map(function( line ){
		return {
			Date: formatDate(new Date(line.created)),
			Text: getText(line),
			Fee: formatAmount(line.fee || 0),
			Amount: formatAmount(line.balance),
		};
	}))
	.pipe(csv({
		separator: ';',
	}))
	.pipe(process.stdout);


function formatAmount( a ){
	if (a.currency)
		return a.currency+' '+formatAmount(a.amount);

	return a / 100;
}

function formatDate( d ){
	return [
		numpad(d.getDate(), 2),
		numpad(d.getMonth() + 1, 2),
		d.getFullYear(),
	].join('/')+' '+[
		numpad(d.getHours(), 2),
		numpad(d.getMinutes(), 2),
	].join(':');
}

function getText( l ){
	switch (true) {
		case l.payout:
			return 'Payout'+(l.bank ? '\nIBAN: '+l.bank.iban : '');

		case l.capture:
			return 'Capture ('+formatAmount(l.amount)+')';

		case l.refund:
			return 'Refund ('+formatAmount(l.amount)+')';

		case l.dispute:
			switch (true) {
				case l.won:
					return 'Dispute won';

				case l.lost:
					return 'Dispute lost';

				default:
					return 'Dispute opened';
			}

		default:
			console.warn('Unknown line type encountered', l);

			return 'Unknown';
	}
}
