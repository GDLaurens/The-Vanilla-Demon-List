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
    // 1. Handle levels outside the scoring range
    if (rank > 150) {
        return 0;
    }

    // 2. Handle Legacy levels (76-150) that aren't 100%
    if (rank > 75 && percent < 100) {
        return 0;
    }

    let baseScore;
    const maxPoints = 350;
    const dropPerRank = 35; // 10% of 350

    // 3. Calculate the Base Score based on Rank
    if (rank <= 75) {
        // This is the fix: Rank 1 gets 350, Rank 2 gets 315, etc.
        // Math.max(50, ...) ensures we don't go below 50 points for the main list
        baseScore = maxPoints - ((rank - 1) * dropPerRank);
        baseScore = Math.max(50, baseScore);
    } else {
        // Flat score for Legacy list
        baseScore = 25;
    }

    // 4. Scale the score by the percentage achieved
    // Formula: base * (current % - (min % - 1)) / (100 - (min % - 1))
    let finalScore = baseScore * ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    finalScore = Math.max(0, finalScore);

    // 5. Apply the 33% penalty for non-100% scores
    if (percent != 100) {
        return round(finalScore - finalScore / 3);
    }

    return Math.max(round(finalScore), 0);
}

/**
 * Rounds numbers to the defined scale accurately
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
