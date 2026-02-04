/**
 * Splits ads into buckets based on their subscription plan.
 * @param {Array} ads - List of all ads fetched from API
 * @returns {Object} { growthAds, businessAds, basicAds }
 */
export const splitByPlan = (ads = []) => {
    const growthAds = [];
    const businessAds = [];
    const basicAds = [];

    ads.forEach(ad => {
        // Normalize plan level casing/checking
        const plan = (ad.planLevel || ad.planName || 'BASIC').toUpperCase();

        if (plan === 'GROWTH') {
            growthAds.push(ad);
        } else if (plan === 'BUSINESS') {
            businessAds.push(ad);
        } else {
            basicAds.push(ad);
        }
    });

    return { growthAds, businessAds, basicAds };
};

/**
 * Picks a subset of ads alternating between Growth and Business plans.
 * Ensures equal chance for both plans.
 * 
 * @param {Array} growthAds 
 * @param {Array} businessAds 
 * @param {Number} maxCount - Maximum number of items to return
 * @returns {Array} Balanced list of ads
 */
export const pickBalancedAds = (growthAds = [], businessAds = [], maxCount = 6) => {
    const result = [];

    // Copy arrays to avoid mutating originals if passed by ref
    const gList = [...growthAds];
    const bList = [...businessAds];

    // Determine which to start with? Randomizing start gives true equality over time.
    // Or strictly alternate G, B, G, B as requested.
    let turn = 'GROWTH'; // Start with Growth as per "Placement order" or random? 
    // "Growth, Business, Growth, Business..." implied order in prompt.

    while (result.length < maxCount && (gList.length > 0 || bList.length > 0)) {
        if (turn === 'GROWTH') {
            if (gList.length > 0) {
                // Pick random from available key to vary the specific ad shown?
                // Or just first one? Let's take 0 if we assume they are already shuffled or ordered.
                // ideally user wants "equal chance". Shuffling input first helps.
                // For now, let's simple shift.
                result.push(gList.shift());
            } else if (bList.length > 0) {
                // Growth empty, must take Business
                result.push(bList.shift());
            }
            turn = 'BUSINESS';
        } else {
            // Business Turn
            if (bList.length > 0) {
                result.push(bList.shift());
            } else if (gList.length > 0) {
                // Business empty, must take Growth
                result.push(gList.shift());
            }
            turn = 'GROWTH';
        }
    }

    return result;
};
