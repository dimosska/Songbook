// static/scripts.js

let transpositionCount = 0; // Initialize a counter

function transposeChords(direction) {
    const lyricsElement = document.getElementById('lyrics');
    let lyrics = lyricsElement.innerText;

    // Updated regex to match chords properly while excluding normal words
    const chordRegex = /(?<!\w)([A-G](?:b|#)?(?:maj|min|m|M|\+|-|dim|aug)?[0-9]*(?:-|\+)?(?:sus[24]?)?(?:b|#)?[0-9]*(\/[A-G](?:b|#)?)?)(?!\w)/g;

    // Replace chords in lyrics
    lyrics = lyrics.replace(chordRegex, (match) => {
        const transposedChord = transpose(match, direction);
        return `<span class="highlight-chord">${transposedChord}</span>`;
    });

    // Update the lyrics element with transposed lyrics
    lyricsElement.innerHTML = lyrics;

    // Update the transposition count
    transpositionCount += direction === '+' ? 1 : -1; // Increment or decrement based on direction
    displayTranspositionCount(); // Call function to update the display

    // Log the updated lyrics and count
    console.log(`Updated Lyrics: ${lyrics}`);
}

const transpose = (chord, direction) => {
    // Match and capture the components of the chord
    const match = chord.match(/([A-G](?:b|#)?)(.*)/);
    if (!match) return chord; // Return original chord if not matched

    let root = match[1]; // Base note (e.g., C, C#)
    const suffix = match[2] || ''; // Chord suffix (e.g., 'maj7', 'sus4', etc.)

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const originalIndex = notes.indexOf(root);
    if (originalIndex === -1) return chord; // Return original if root note not found

    // Transpose logic
    let newNote;
    if (direction === '+') {
        newNote = notes[(originalIndex + 1) % notes.length]; // Move up
    } else if (direction === '-') {
        newNote = notes[(originalIndex - 1 + notes.length) % notes.length]; // Move down
    } else {
        return chord; // If direction is not recognized, return original chord
    }

    // Create the new chord with the transposed note
    return newNote + suffix; // Append the original suffix to the new root
}

function displayTranspositionCount() {
    const countElement = document.getElementById('transposition-count');
    countElement.innerText = `${transpositionCount}`; // Update the counter display
}

let currentFontSize = 16; // Default font size in pixels

function changeFontSize(change) {
    const lyricsElement = document.getElementById('lyrics');
    
    // Limit the font size
    if ((currentFontSize <= 10 && change < 0) || (currentFontSize >= 40 && change > 0)) {
        return; // Prevent further changes if limits are reached
    }

    // Update the current font size based on the button clicked
    currentFontSize += change; // Increase or decrease font size
    lyricsElement.style.fontSize = `${currentFontSize}px`; // Apply the new font size
}


const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})