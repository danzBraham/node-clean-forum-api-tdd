/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn(
    'comments',
    {
      likes: {
        type: 'INTEGER',
        notNull: true,
        default: 0,
      },
    },
    { ifNotExists: true },
  );
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'likes');
};
