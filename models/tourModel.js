const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a unique name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    validate: [validator.isAlpha, 'A tour name must contain only letters'],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either easy, medium or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    // custom validator
    validate: {
      validator: function (val) {
        // this only work when creating new document that would not work for the update document
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  },

  summary: {
    type: String,
    //trim will remove all the white space at the begining and at the end
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

// DOCUMENT MIDDLEWARE: RUNS BEFORE .SAVE() AND .CREATE()
tourSchema.pre('save', function (next) {
  // console.log(this); //this will point here to the currently process document.
  this.slug = slugify(this.name, { lower: true });
  next();
});

// we can create more than 1 pre middleware.
tourSchema.pre('save', function (next) {
  next();
});

// POST MIDDLEWARE EXECUTE AFTER THE PRE MIDDLEWARE EXECUTE AFTER CREATING AND SAVING THE DOCUMENT TO DATABASE.
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

// QUERY MIDDLEWARE
// execute before the query execute, for find1, count, update they would'nt work we have to specify separatly
tourSchema.pre(/^find/, function (next) {
  // execute for all query which starts from find.
  // tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// run after the query has already been executed.
tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //adding in begining of an array
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
