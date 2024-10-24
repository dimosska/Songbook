// static/scripts.js

let transpositionCount = 0; // Initialize a counter

function transposeChords(direction) {
    const lyricsElement = document.getElementById('lyrics');
    let lyrics = lyricsElement.innerText;

    // Regex to match chords while excluding normal words
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
    displayTranspositionCount(); // Update the display

    // Log the updated lyrics and count
    console.log(`Updated Lyrics: ${lyrics}`);
}

const transpose = (chord, direction) => {
    // Match and capture the components of the chord, including the bass note if it exists
    const match = chord.match(/([A-G](?:b|#)?)(.*?)(\/([A-G](?:b|#)?))?$/);
    if (!match) return chord; // Return original chord if not matched

    let root = match[1]; // Base note of the chord (e.g., C, C#)
    const suffix = match[2] || ''; // Chord suffix (e.g., 'maj7', 'sus4', etc.)
    let bass = match[4] || ''; // Bass note (e.g., G from /G), or empty if none

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Transpose the root note
    const originalRootIndex = notes.indexOf(root);
    if (originalRootIndex === -1) return chord; // Return original if root note not found

    let newRoot;
    if (direction === '+') {
        newRoot = notes[(originalRootIndex + 1) % notes.length]; // Move root note up
    } else if (direction === '-') {
        newRoot = notes[(originalRootIndex - 1 + notes.length) % notes.length]; // Move root note down
    } else {
        return chord; // If direction is not recognized, return original chord
    }

    // Transpose the bass note if it exists
    if (bass) {
        const originalBassIndex = notes.indexOf(bass); // Find the bass note in the notes array
        if (originalBassIndex !== -1) {
            let newBass;
            if (direction === '+') {
                newBass = notes[(originalBassIndex + 1) % notes.length]; // Move bass note up
            } else if (direction === '-') {
                newBass = notes[(originalBassIndex - 1 + notes.length) % notes.length]; // Move bass note down
            }
            bass = '/' + newBass; // Add the slash back to the transposed bass note
        }
    }

    // Debug logging to see the transposed chord and bass note
    console.log(`Transposed Root: ${newRoot}, Suffix: ${suffix}, Bass: ${bass}`);

    // Return the transposed chord with both root and bass note (if present)
    return newRoot + suffix + bass;
};

// Mapping between sharp and flat equivalents
const sharpToFlat = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb'
};

const flatToSharp = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
};

// Function to convert a single chord from sharp to flat or vice versa
function convertChord(chord, toFlat) {
    // Match and capture the root, suffix, and bass (if present)
    const match = chord.match(/([A-G](?:b|#)?)(.*?)(\/([A-G](?:b|#)?))?$/);
    if (!match) return chord; // Return original chord if not matched

    let root = match[1]; // Base note of the chord (e.g., C, C#)
    const suffix = match[2] || ''; // Chord suffix (e.g., 'maj7', 'sus4', etc.)
    let bass = match[4] || ''; // Bass note (e.g., G from /G), or empty if none

    // Convert root note
    if (toFlat && sharpToFlat[root]) {
        root = sharpToFlat[root]; // Convert sharp to flat
    } else if (!toFlat && flatToSharp[root]) {
        root = flatToSharp[root]; // Convert flat to sharp
    }

    // Convert bass note if it exists
    if (bass) {
        if (toFlat && sharpToFlat[bass]) {
            bass = sharpToFlat[bass]; // Convert sharp bass to flat bass
        } else if (!toFlat && flatToSharp[bass]) {
            bass = flatToSharp[bass]; // Convert flat bass to sharp bass
        }
    }

    // Return the converted chord
    return root + suffix + (bass ? '/' + bass : '');
}

// Function to toggle between sharp and flat notation
function toggleChordNotation() {
    const toFlat = document.getElementById('chordNotationSwitch').checked; // Check if flats are selected
    const lyricsElement = document.getElementById('lyrics');
    let lyrics = lyricsElement.innerText;

    // Updated regex to match chords properly while excluding normal words
    const chordRegex = /(?<!\w)([A-G](?:b|#)?(?:maj|min|m|M|\+|-|dim|aug)?[0-9]*(?:-|\+)?(?:sus[24]?)?(?:b|#)?[0-9]*(\/[A-G](?:b|#)?)?)(?!\w)/g;

    // Replace chords in lyrics with converted ones
    lyrics = lyrics.replace(chordRegex, (match) => {
        return `<span class="highlight-chord">${convertChord(match, toFlat)}</span>`;
    });

    // Update the lyrics element with converted chords
    lyricsElement.innerHTML = lyrics;

    // Optional: Add console logging for debugging
    console.log(`Converted to ${toFlat ? 'Flats' : 'Sharps'}: ${lyrics}`);
}

// Attach event listener to the Bootstrap switch
document.getElementById('chordNotationSwitch').addEventListener('change', toggleChordNotation);



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

// Bootstrap Modal Example
const myModal = document.getElementById('myModal');
const myInput = document.getElementById('myInput');

myModal.addEventListener('shown.bs.modal', () => {
    myInput.focus();
});
