module.exports = [
		
		{from:"/videos/cool-games.html", to:"/games.html"},
		{from:"\\/(local)\/+((?:\\w+)(?:-?\\w+)+).html", to:"/local.html?city=$2&section=$1"},
		{from:"\\/(\\w+)\/+((?:\\w+)(?:-?\\w+)+).html",to:"/$1.html?seriesname=$2"}
];;