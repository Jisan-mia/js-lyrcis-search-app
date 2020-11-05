const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';



//search by song or artist
async function searchSongs(term){
	const res = await fetch(`${apiURL}/suggest/${term}`);
	const data = await res.json();
	// console.log(data)

	showData(data);
/*
		
	})*/
}
// /show song and artist in DOM
function showData(data){
	/*let output = "";
	data.data.forEach(song => {
		output += `
			<li>
				<span><strong>${song.artist.name} </strong> - ${song.title} </span><button class="btn"  data-artist="${song.artist.name}" data-songTitle="${song.title}">Get Lyrics</button>
			 </li>
		`;
	})

	result.innerHTML = `
	<ul class="songs">
		${output}
	</ul> 
	`*/

	result.innerHTML = `
	<ul class="songs"> 
		${data.data.map(song => `
			<li>
				<span><strong>${song.artist.name} </strong> - ${song.title} </span><button class="btn"  data-artist="${song.artist.name}" data-songTitle="${song.title}">Get Lyrics</button>
			 </li>`)
			.join('')
		}

	</ul>
	`;



	if(data.prev || data.next) {
		more.innerHTML = `
			${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev </button>` : '' }
			${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">  Next </button>` : ''}
		`;
	} else{
		more.innerHTML = '';
	}

}


// getting more songs either next or prev
async function getMoreSongs(url){
	const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
	const data = await res.json();

	showData(data)
}


//event listeners
form.addEventListener('submit', e=> {
	e.preventDefault();

	document.getElementById('lyricsDiv').innerHTML = "";
	const searchTerm = search.value.trim();
	if(!searchTerm){
		alert("Please type artist or song name")
	}else{
		searchSongs(searchTerm);
	}

})

//get song lyrcis
async function getLyrics(artist, songTitle){
	const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
	const data = await res.json();

	const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, ' <br> ');

	// result.innerHTML = `<h2> <strong>${artist}</strong> - ${songTitle}</h2>
	// <span> ${lyrics}</span>`;

	// more.innerHTML = '';
	let lyricsDiv = document.getElementById('lyricsDiv');
	
	
	lyricsDiv.innerHTML = `<h2> <strong>${artist}</strong> - ${songTitle}</h2>
		<span> ${lyrics}</span>`;
	

	
}


//get lyrics button click
result.addEventListener('click', e => {
	// console.log(e.target);
	const clickedElm = e.target;
	
	if(clickedElm.tagName === 'BUTTON'){
		
		const artist = clickedElm.getAttribute('data-artist');
		const songTitle = clickedElm.getAttribute('data-songTitle');

		getLyrics(artist, songTitle)
		
	}
})