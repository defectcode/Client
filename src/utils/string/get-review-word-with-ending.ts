export const getReviewWordWithEnding = (reviewCount: number) => {
	if ([1, 21, 31].includes(reviewCount)) {
		return `${reviewCount} review`
	} else if ([2, 3, 4, 22, 23, 24, 34].includes(reviewCount)) {
		return `${reviewCount} reviews`
	} else {
		return `${reviewCount} reviews`
	}
}
