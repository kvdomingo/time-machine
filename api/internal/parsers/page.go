package parsers

import "strconv"

func ParsePageString(rawPage string) (int32, error) {
	page64, err := strconv.ParseInt(rawPage, 10, 32)
	if err != nil {
		return 1, err
	}

	page := int32(page64)
	if page == 0 {
		page = 1
	}
	return page, nil
}
