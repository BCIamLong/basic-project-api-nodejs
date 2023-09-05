const APIFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');

const deleteOne = Model =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with this id', 404));
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

const updateOne = Model =>
  asyncCatch(async (req, res, next) => {
    const docUpdate = await Model.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!docUpdate)
      return next(new AppError('No document found with this id', 404));
    res.status(200).json({
      status: 'Success',
      data: {
        doc: docUpdate,
      },
    });
  });

const createOne = Model =>
  asyncCatch(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        doc: newDoc,
      },
    });
  });

//
// const getOne = (Model, populateOptions) =>
//   asyncCatch(async (req, res, next) => {
//     let query = Model.findById(req.params.id);
//     if (populateOptions)
//       query = Model.findById(req.params.id).populate(populateOptions);
//     // if (req.body.action === 'getUser' && req.user.role === 'admin')
//     //   query = Model.findById(req.params.id).select(
//     //     '+email +phone +role +active',
//     //   );

//     const doc = await query;
//     if (!doc) return next(new AppError('No document found with this id', 404));
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         doc,
//       },
//     });
//   });

const checkAliasStatsRoutes = id =>
  id === 'posts-stats' || id === 'around-posts';

const getOne = Model =>
  asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (checkAliasStatsRoutes(id)) return next();

    const doc = await Model.findById(id);
    if (!doc) return next(new AppError('No document found with this id', 404));
    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

//get all comments, all comments on post, all posts, all posts on user

const getAll = Model =>
  asyncCatch(async (req, res, next) => {
    const countDocs = await Model.countDocuments(req.body.filter);
    const apiFeatures = new APIFeature(Model.find(req.body.filter), req.query)
      .filter()
      .sort()
      .select()
      .pagination(countDocs);

    const docs = await apiFeatures.query; //.explain(); //! watch query stats so explain() is useful for development

    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
  checkAliasStatsRoutes,
};
