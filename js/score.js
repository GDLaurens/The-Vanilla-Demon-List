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

    let baseScore;
    const maxPoints = 350;
    const dropPerRank = 35; // 10% of 350

    if (rank <= 75) {
        // Linear drop logic:
        // Rank 1: 350 - (0 * 35) = 350
        // Rank 2: 350 - (1 * 35) = 315
        // Rank 3: 350 - (2 * 35) = 280
        // We use Math.max(50, ...) so that levels below Rank 9 don't hit 0 or negative points.
        baseScore = Math.max(50, maxPoints - ((rank - 1) * dropPerRank));
    } else {
        // Standard flat score for Legacy levels (76-150)
        baseScore = 25;
    }

    // Calculate score based on the percentage achieved
    let currentScore = baseScore * ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    currentScore = Math.max(0, currentScore);

    // Apply the standard 33% penalty for non-100% completions
    if (percent != 100) {
        return round(currentScore - currentScore / 3);
    }

    return Math.max(round(currentScore), 0);
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
