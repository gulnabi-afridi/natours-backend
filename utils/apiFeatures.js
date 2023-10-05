class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // filtering the tour
    // buid query
    // 1A.) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query);

    // 1B.) Advanced filtering
    // the query would be like that 👇
    // {difficulty:'easy',duration:{$gte:5}}
    //   but we got in that form 👇
    // {difficulty:'easy',duration:{gte:5}}  // so we have to add with req.query the $ sign
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    // 2) sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
      //-----> provide in that form 👉 sort('price ratingAverage')
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      // query = query.select('name duration price') accept in that format
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // excluding v
    }
    return this;
  }

  paginate() {
    // pagination
    // page=2&limit=5  1-5 page 1 , 6-10 page 2 , 11-15 page 3 👇
    // we need page 2 so we have to skip 5 document and starts from 6
    // query = query.skip(2).limit(5)

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
