/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    // Rank 151+ or Legacy levels (76-150) with less than 100% give 0 points
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    let score;

    // Check if the level is in the Top 75
    if (rank <= 75) {
        // All Top 75 levels give a base of 350 points
        score = 350 * ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    } else {
        // Standard formula for levels 76-150 (Legacy)
        score = (-24.9975 * Math.pow(rank - 1, 0.4) + 200) *
            ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    }

    score = Math.max(0, score);

    // Apply penalty for non-100% completions
    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}

/**
 * Rounds numbers to the defined scale accurately
 * @param {Number} num 
 * @returns {Number}
 */
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
