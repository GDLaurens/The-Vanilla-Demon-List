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
    const dropPerRank = 17.5; // 5% of 350

    // 3. Calculate the Base Score based on Rank
    if (rank <= 75) {
        // Calculation: 350 - ((rank - 1) * 17.5)
        // #1 Windy Landscape: 350 - 0 = 350
        // #2 Nine Circles: 350 - 17.5 = 332.5
        // #3 Verity: 350 - 35 = 315
        baseScore = maxPoints - ((rank - 1) * dropPerRank);
        
        // We keep the floor at 50 so levels don't hit 0 points too early
        baseScore = Math.max(50, baseScore);
    } else {
        // Flat score for Legacy list
        baseScore = 25;
    }

    // 4. Scale the score by the percentage achieved
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
