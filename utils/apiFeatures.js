class APIFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryOb = { ...this.queryStr };
    //*1, clear options: field, page, limit, sort
    const options = ['fields', 'page', 'limit', 'sort'];
    options.forEach((el) => delete queryOb[el]);
    // options.forEach((el) => {
    //   if (queryOb[el]) delete queryOb[el];
    // });
    // const keys = Object.keys(queryOb).forEach((el) => {
    //   if (options.includes(el)) delete queryOb[el];
    // });
    //*2, if we have $gte, $lte, $gt, $lt operator => cuz when we request url with operator it'll look like this: {duration: {gte: 2}, price: 200} => so problem is consvert gte to $gte
    // --> use regex
    let operatorStr = JSON.stringify(queryOb);
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace: read this
    operatorStr = operatorStr.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}` // call back function use for change all value if it's match
    );
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll read this
    // operatorStr = operatorStr.replaceAll(/\b(gte|lte|gt|lt)\b/g, `$${match}`);
    this.query = this.query.find(JSON.parse(operatorStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortQuery = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortQuery);
    }
    if (!this.queryStr.sort) this.query = this.query.sort('-createdAt');

    return this;
  }

  select() {
    if (this.queryStr.fields) {
      const fieldsQuery = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fieldsQuery);
    }
    if (!this.queryStr.fields) this.query.select('-__v');

    return this;
  }

  pagination(count) {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(count / limit);
    if (page <= totalPages) this.query = this.query.skip(skip).limit(limit);
    else throw new Error('Page invalid');

    return this;
  }
}

module.exports = APIFeature;
